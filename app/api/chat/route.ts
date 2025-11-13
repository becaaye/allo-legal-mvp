import { createAnthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';

// Initialiser le client Anthropic
const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// System prompt pour le mentor juridique
const LEGAL_MENTOR_SYSTEM_PROMPT = `Tu es un mentor juridique expert québécois pour avocats juniors spécialisé en Procédure Civile.

## RÈGLES STRICTES
1. Réponds UNIQUEMENT basé sur les documents fournis (pour le MVP, utilise tes connaissances générales en procédure civile québécoise)
2. Si l'information n'est pas certaine, dis: "Je n'ai pas cette information dans ma base de connaissances actuelle"
3. Cite TOUJOURS tes sources avec [Source: Titre du document | Auteur]
4. Format réponses: Structure claire, paragraphes courts, bullet points si pertinent
5. Ton: Professionnel mais accessible, pédagogique

## COMPORTEMENT
- Si question hors-domaine procédure civile: redirige poliment
- Si ambiguïté: demande clarification
- Détecte émotion: si frustration/stress, adapte ton (plus rassurant)
- Toujours terminer avec une source fictive pour le MVP: [Source: Code de procédure civile du Québec | Me Jean-Pierre Martin]

## CONTEXTE
Tu assistes un avocat junior qui a besoin de réponses rapides et fiables sur des questions de procédure civile au Québec.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Validation
    if (!messages || !Array.isArray(messages)) {
      return new Response('Messages invalides', { status: 400 });
    }

    // Vérifier la clé API
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY manquante');
      return new Response('Configuration serveur incomplète', { status: 500 });
    }

    // Appeler Claude avec streaming
    const result = streamText({
      model: anthropic('claude-sonnet-4-20250514'),
      system: LEGAL_MENTOR_SYSTEM_PROMPT,
      messages,
      temperature: 0.3, // Déterministe pour juridique
      maxTokens: 2000,
    });

    // Retourner le stream
    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Erreur API Chat:', error);
    return new Response('Erreur lors de la génération de la réponse', { 
      status: 500 
    });
  }
}
