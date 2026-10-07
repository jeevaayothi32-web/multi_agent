import { NextResponse } from 'next/server';
import { AgentName, ProgressEvent } from '../../../types/analysis';
import { analyzeFeasibility } from '../../../lib/agents/feasibility';
import { analyzeMarket } from '../../../lib/agents/market';
import { analyzeTechnical } from '../../../lib/agents/technical';
import { analyzeInnovation } from '../../../lib/agents/innovation';
import { analyzeRisk } from '../../../lib/agents/risk';
import { analyzeLegal } from '../../../lib/agents/legal';
import { analyzeSuggestion } from '../../../lib/agents/suggestion';
import { DEMO_IDEA, DEMO_REPORT } from '../../../lib/ai/fallback';

export const runtime = 'nodejs'; // Node runtime supports streaming

export async function POST(req: Request) {
  try {
    const { idea } = await req.json();

    if (!idea || typeof idea !== 'string' || idea.trim().length === 0) {
      return NextResponse.json({ error: 'Please enter a valid idea description.' }, { status: 400 });
    }

    const encoder = new TextEncoder();
    const apiKey = process.env.OPENROUTER_API_KEY;

    // Check if OpenRouter key is configured. If not, fallback to Demo simulation
    if (!apiKey) {
      const isDemoIdea = idea.trim().toLowerCase() === DEMO_IDEA.trim().toLowerCase();

      if (isDemoIdea) {
        const stream = new ReadableStream({
          async start(controller) {
            const sendEvent = (event: ProgressEvent) => {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
            };

            // Start all agents in parallel
            const agentNames: AgentName[] = ['feasibility', 'market', 'technical', 'innovation', 'risk', 'legal', 'suggestion'];
            for (const name of agentNames) {
              sendEvent({ type: 'start', agent: name });
            }

            // Simulate parallel staggered completions
            const staggedCompletions = [
              { name: 'feasibility', delay: 700, result: DEMO_REPORT.results.feasibility },
              { name: 'market', delay: 1400, result: DEMO_REPORT.results.market },
              { name: 'technical', delay: 1000, result: DEMO_REPORT.results.technical },
              { name: 'innovation', delay: 1900, result: DEMO_REPORT.results.innovation },
              { name: 'risk', delay: 1200, result: DEMO_REPORT.results.risk },
              { name: 'legal', delay: 1600, result: DEMO_REPORT.results.legal },
              { name: 'suggestion', delay: 2200, result: DEMO_REPORT.results.suggestion },
            ];

            await Promise.all(
              staggedCompletions.map(async (item) => {
                await new Promise((resolve) => setTimeout(resolve, item.delay));
                sendEvent({
                  type: 'success',
                  agent: item.name as AgentName,
                  result: item.result,
                });
              })
            );

            controller.close();
          },
        });

        return new Response(stream, {
          headers: {
            'Content-Type': 'text/event-stream; charset=utf-8',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
          },
        });
      } else {
        return NextResponse.json({
          error: 'OpenRouter API Key is missing. Please configure OPENROUTER_API_KEY in your .env.local file to analyze custom ideas, or try the Demo Idea to run a simulated analysis.',
        }, { status: 400 });
      }
    }

    // API Key is available - run real analysis
    const stream = new ReadableStream({
      async start(controller) {
        const sendEvent = (event: ProgressEvent) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
        };

        const agents = [
          { name: 'feasibility' as AgentName, fn: analyzeFeasibility },
          { name: 'market' as AgentName, fn: analyzeMarket },
          { name: 'technical' as AgentName, fn: analyzeTechnical },
          { name: 'innovation' as AgentName, fn: analyzeInnovation },
          { name: 'risk' as AgentName, fn: analyzeRisk },
          { name: 'legal' as AgentName, fn: analyzeLegal },
          { name: 'suggestion' as AgentName, fn: analyzeSuggestion },
        ];

        // Trigger execution of all agents in parallel
        const promises = agents.map(async (agent) => {
          sendEvent({ type: 'start', agent: agent.name });
          try {
            const result = await agent.fn(idea);
            sendEvent({ type: 'success', agent: agent.name, result });
          } catch (error: any) {
            console.error(`Agent ${agent.name} failed:`, error);
            sendEvent({
              type: 'error',
              agent: agent.name,
              error: error.message || 'Analysis failed',
            });
          }
        });

        await Promise.all(promises);
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('Unhandled API exception:', error);
    return NextResponse.json({ error: 'Internal Server Error: ' + error.message }, { status: 500 });
  }
}
