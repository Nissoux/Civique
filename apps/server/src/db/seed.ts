import 'dotenv/config';
import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { THEMES } from '@civique/shared';
import * as schema from './schema.js';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

// ────────────────────────────────────────────────────────────────
// Themes
// ────────────────────────────────────────────────────────────────

const themesData = THEMES.map((t, i) => ({
  id: t.id,
  code: t.code,
  nameFr: t.nameFr,
  icon: t.icon,
  color: t.color,
  displayOrder: i + 1,
}));

// ────────────────────────────────────────────────────────────────
// Questions - 10+ per theme = 50+ total
// ────────────────────────────────────────────────────────────────

interface QuestionSeed {
  themeId: number;
  type: 'knowledge' | 'situational';
  difficulty: number;
  isPremium: boolean;
  textFr: string;
  explanationFr: string;
  choicesFr: { id: 'a' | 'b' | 'c' | 'd'; text: string }[];
  correctChoice: 'a' | 'b' | 'c' | 'd';
  translations?: {
    lang: 'ar' | 'es' | 'pt';
    text: string;
    explanation: string;
    choices: { id: 'a' | 'b' | 'c' | 'd'; text: string }[];
  }[];
}

const questionsData: QuestionSeed[] = [
  // ── Theme 1: Principes et valeurs de la Republique (id=1) ──
  {
    themeId: 1,
    type: 'knowledge',
    difficulty: 1,
    isPremium: false,
    textFr: 'Quelle est la devise de la Republique francaise ?',
    explanationFr: 'La devise de la France est "Liberte, Egalite, Fraternite". Elle figure dans la Constitution et est affichee sur les frontons des batiments publics.',
    choicesFr: [
      { id: 'a', text: 'Liberte, Egalite, Fraternite' },
      { id: 'b', text: 'Unite, Force, Progres' },
      { id: 'c', text: 'Travail, Famille, Patrie' },
      { id: 'd', text: 'Paix, Justice, Liberte' },
    ],
    correctChoice: 'a',
    translations: [
      {
        lang: 'ar',
        text: '\u0645\u0627 \u0647\u0648 \u0634\u0639\u0627\u0631 \u0627\u0644\u062c\u0645\u0647\u0648\u0631\u064a\u0629 \u0627\u0644\u0641\u0631\u0646\u0633\u064a\u0629\u061f',
        explanation: '\u0634\u0639\u0627\u0631 \u0641\u0631\u0646\u0633\u0627 \u0647\u0648 "\u062d\u0631\u064a\u0629\u060c \u0645\u0633\u0627\u0648\u0627\u0629\u060c \u0625\u062e\u0627\u0621". \u0648\u0647\u0648 \u0645\u0646\u0635\u0648\u0635 \u0639\u0644\u064a\u0647 \u0641\u064a \u0627\u0644\u062f\u0633\u062a\u0648\u0631.',
        choices: [
          { id: 'a', text: '\u062d\u0631\u064a\u0629\u060c \u0645\u0633\u0627\u0648\u0627\u0629\u060c \u0625\u062e\u0627\u0621' },
          { id: 'b', text: '\u0648\u062d\u062f\u0629\u060c \u0642\u0648\u0629\u060c \u062a\u0642\u062f\u0645' },
          { id: 'c', text: '\u0639\u0645\u0644\u060c \u0639\u0627\u0626\u0644\u0629\u060c \u0648\u0637\u0646' },
          { id: 'd', text: '\u0633\u0644\u0627\u0645\u060c \u0639\u062f\u0627\u0644\u0629\u060c \u062d\u0631\u064a\u0629' },
        ],
      },
      {
        lang: 'es',
        text: 'Cual es el lema de la Republica Francesa?',
        explanation: 'El lema de Francia es "Libertad, Igualdad, Fraternidad". Esta inscrito en la Constitucion.',
        choices: [
          { id: 'a', text: 'Libertad, Igualdad, Fraternidad' },
          { id: 'b', text: 'Unidad, Fuerza, Progreso' },
          { id: 'c', text: 'Trabajo, Familia, Patria' },
          { id: 'd', text: 'Paz, Justicia, Libertad' },
        ],
      },
      {
        lang: 'pt',
        text: 'Qual e o lema da Republica Francesa?',
        explanation: 'O lema da Franca e "Liberdade, Igualdade, Fraternidade". Esta inscrito na Constituicao.',
        choices: [
          { id: 'a', text: 'Liberdade, Igualdade, Fraternidade' },
          { id: 'b', text: 'Unidade, Forca, Progresso' },
          { id: 'c', text: 'Trabalho, Familia, Patria' },
          { id: 'd', text: 'Paz, Justica, Liberdade' },
        ],
      },
    ],
  },
  {
    themeId: 1,
    type: 'knowledge',
    difficulty: 1,
    isPremium: false,
    textFr: 'Quels sont les symboles de la Republique francaise ?',
    explanationFr: 'Les principaux symboles sont : le drapeau tricolore, la Marseillaise (hymne national), Marianne, et la devise "Liberte, Egalite, Fraternite".',
    choicesFr: [
      { id: 'a', text: 'Le drapeau tricolore, la Marseillaise, Marianne' },
      { id: 'b', text: 'Le lion, le drapeau rouge, la Tour Eiffel' },
      { id: 'c', text: 'La croix, le coq, la fleur de lys' },
      { id: 'd', text: 'L\'aigle, le drapeau blanc, le soleil' },
    ],
    correctChoice: 'a',
    translations: [
      {
        lang: 'ar',
        text: '\u0645\u0627 \u0647\u064a \u0631\u0645\u0648\u0632 \u0627\u0644\u062c\u0645\u0647\u0648\u0631\u064a\u0629 \u0627\u0644\u0641\u0631\u0646\u0633\u064a\u0629\u061f',
        explanation: '\u0627\u0644\u0631\u0645\u0648\u0632 \u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629 \u0647\u064a: \u0627\u0644\u0639\u0644\u0645 \u0627\u0644\u062b\u0644\u0627\u062b\u064a \u0627\u0644\u0623\u0644\u0648\u0627\u0646\u060c \u0627\u0644\u0645\u0627\u0631\u0633\u064a\u064a\u0632\u060c \u0645\u0627\u0631\u064a\u0627\u0646.',
        choices: [
          { id: 'a', text: '\u0627\u0644\u0639\u0644\u0645 \u0627\u0644\u062b\u0644\u0627\u062b\u064a\u060c \u0627\u0644\u0645\u0627\u0631\u0633\u064a\u064a\u0632\u060c \u0645\u0627\u0631\u064a\u0627\u0646' },
          { id: 'b', text: '\u0627\u0644\u0623\u0633\u062f\u060c \u0627\u0644\u0639\u0644\u0645 \u0627\u0644\u0623\u062d\u0645\u0631\u060c \u0628\u0631\u062c \u0625\u064a\u0641\u0644' },
          { id: 'c', text: '\u0627\u0644\u0635\u0644\u064a\u0628\u060c \u0627\u0644\u062f\u064a\u0643\u060c \u0632\u0647\u0631\u0629 \u0627\u0644\u0632\u0646\u0628\u0642' },
          { id: 'd', text: '\u0627\u0644\u0646\u0633\u0631\u060c \u0627\u0644\u0639\u0644\u0645 \u0627\u0644\u0623\u0628\u064a\u0636\u060c \u0627\u0644\u0634\u0645\u0633' },
        ],
      },
      {
        lang: 'es',
        text: 'Cuales son los simbolos de la Republica Francesa?',
        explanation: 'Los simbolos principales son: la bandera tricolor, la Marsellesa, Marianne y el lema.',
        choices: [
          { id: 'a', text: 'La bandera tricolor, la Marsellesa, Marianne' },
          { id: 'b', text: 'El leon, la bandera roja, la Torre Eiffel' },
          { id: 'c', text: 'La cruz, el gallo, la flor de lis' },
          { id: 'd', text: 'El aguila, la bandera blanca, el sol' },
        ],
      },
      {
        lang: 'pt',
        text: 'Quais sao os simbolos da Republica Francesa?',
        explanation: 'Os principais simbolos sao: a bandeira tricolor, a Marselhesa, Marianne e o lema.',
        choices: [
          { id: 'a', text: 'A bandeira tricolor, a Marselhesa, Marianne' },
          { id: 'b', text: 'O leao, a bandeira vermelha, a Torre Eiffel' },
          { id: 'c', text: 'A cruz, o galo, a flor-de-lis' },
          { id: 'd', text: 'A aguia, a bandeira branca, o sol' },
        ],
      },
    ],
  },
  {
    themeId: 1,
    type: 'knowledge',
    difficulty: 1,
    isPremium: false,
    textFr: 'Que signifie la laicite en France ?',
    explanationFr: 'La laicite garantit la liberte de conscience et la separation des Eglises et de l\'Etat. La loi de 1905 est le texte fondateur.',
    choicesFr: [
      { id: 'a', text: 'La separation des Eglises et de l\'Etat' },
      { id: 'b', text: 'L\'interdiction de toutes les religions' },
      { id: 'c', text: 'L\'obligation d\'etre athee' },
      { id: 'd', text: 'Le catholicisme comme religion officielle' },
    ],
    correctChoice: 'a',
    translations: [
      {
        lang: 'ar',
        text: '\u0645\u0627\u0630\u0627 \u062a\u0639\u0646\u064a \u0627\u0644\u0639\u0644\u0645\u0627\u0646\u064a\u0629 \u0641\u064a \u0641\u0631\u0646\u0633\u0627\u061f',
        explanation: '\u0627\u0644\u0639\u0644\u0645\u0627\u0646\u064a\u0629 \u062a\u0636\u0645\u0646 \u062d\u0631\u064a\u0629 \u0627\u0644\u0636\u0645\u064a\u0631 \u0648\u0641\u0635\u0644 \u0627\u0644\u0643\u0646\u0627\u0626\u0633 \u0639\u0646 \u0627\u0644\u062f\u0648\u0644\u0629.',
        choices: [
          { id: 'a', text: '\u0641\u0635\u0644 \u0627\u0644\u0643\u0646\u0627\u0626\u0633 \u0639\u0646 \u0627\u0644\u062f\u0648\u0644\u0629' },
          { id: 'b', text: '\u0645\u0646\u0639 \u062c\u0645\u064a\u0639 \u0627\u0644\u0623\u062f\u064a\u0627\u0646' },
          { id: 'c', text: '\u0648\u062c\u0648\u0628 \u0627\u0644\u0625\u0644\u062d\u0627\u062f' },
          { id: 'd', text: '\u0627\u0644\u0643\u0627\u062b\u0648\u0644\u064a\u0643\u064a\u0629 \u0643\u062f\u064a\u0646 \u0631\u0633\u0645\u064a' },
        ],
      },
      {
        lang: 'es',
        text: 'Que significa la laicidad en Francia?',
        explanation: 'La laicidad garantiza la libertad de conciencia y la separacion de Iglesias y Estado.',
        choices: [
          { id: 'a', text: 'La separacion de Iglesias y Estado' },
          { id: 'b', text: 'La prohibicion de todas las religiones' },
          { id: 'c', text: 'La obligacion de ser ateo' },
          { id: 'd', text: 'El catolicismo como religion oficial' },
        ],
      },
      {
        lang: 'pt',
        text: 'O que significa a laicidade na Franca?',
        explanation: 'A laicidade garante a liberdade de consciencia e a separacao entre Igrejas e Estado.',
        choices: [
          { id: 'a', text: 'A separacao entre Igrejas e Estado' },
          { id: 'b', text: 'A proibicao de todas as religioes' },
          { id: 'c', text: 'A obrigacao de ser ateu' },
          { id: 'd', text: 'O catolicismo como religiao oficial' },
        ],
      },
    ],
  },
  {
    themeId: 1,
    type: 'knowledge',
    difficulty: 2,
    isPremium: false,
    textFr: 'Quel est l\'hymne national de la France ?',
    explanationFr: 'L\'hymne national de la France est la Marseillaise, composee par Rouget de Lisle en 1792.',
    choicesFr: [
      { id: 'a', text: 'La Marseillaise' },
      { id: 'b', text: 'La Parisienne' },
      { id: 'c', text: 'Le Chant du Depart' },
      { id: 'd', text: 'God Save the King' },
    ],
    correctChoice: 'a',
    translations: [
      { lang: 'ar', text: '\u0645\u0627 \u0647\u0648 \u0627\u0644\u0646\u0634\u064a\u062f \u0627\u0644\u0648\u0637\u0646\u064a \u0644\u0641\u0631\u0646\u0633\u0627\u061f', explanation: '\u0627\u0644\u0646\u0634\u064a\u062f \u0627\u0644\u0648\u0637\u0646\u064a \u0647\u0648 \u0627\u0644\u0645\u0627\u0631\u0633\u064a\u064a\u0632.', choices: [{ id: 'a', text: '\u0627\u0644\u0645\u0627\u0631\u0633\u064a\u064a\u0632' }, { id: 'b', text: '\u0627\u0644\u0628\u0627\u0631\u064a\u0633\u064a\u0629' }, { id: 'c', text: '\u0646\u0634\u064a\u062f \u0627\u0644\u0631\u062d\u064a\u0644' }, { id: 'd', text: '\u062d\u0641\u0638 \u0627\u0644\u0644\u0647 \u0627\u0644\u0645\u0644\u0643' }] },
      { lang: 'es', text: 'Cual es el himno nacional de Francia?', explanation: 'El himno nacional es la Marsellesa.', choices: [{ id: 'a', text: 'La Marsellesa' }, { id: 'b', text: 'La Parisina' }, { id: 'c', text: 'El Canto de Partida' }, { id: 'd', text: 'God Save the King' }] },
      { lang: 'pt', text: 'Qual e o hino nacional da Franca?', explanation: 'O hino nacional e a Marselhesa.', choices: [{ id: 'a', text: 'A Marselhesa' }, { id: 'b', text: 'A Parisiense' }, { id: 'c', text: 'O Canto da Partida' }, { id: 'd', text: 'God Save the King' }] },
    ],
  },
  {
    themeId: 1,
    type: 'knowledge',
    difficulty: 2,
    isPremium: false,
    textFr: 'Quelles sont les trois couleurs du drapeau francais (de gauche a droite) ?',
    explanationFr: 'Le drapeau tricolore est compose de trois bandes verticales : bleu, blanc, rouge.',
    choicesFr: [
      { id: 'a', text: 'Bleu, blanc, rouge' },
      { id: 'b', text: 'Rouge, blanc, bleu' },
      { id: 'c', text: 'Blanc, bleu, rouge' },
      { id: 'd', text: 'Bleu, rouge, blanc' },
    ],
    correctChoice: 'a',
    translations: [
      { lang: 'ar', text: '\u0645\u0627 \u0647\u064a \u0627\u0644\u0623\u0644\u0648\u0627\u0646 \u0627\u0644\u062b\u0644\u0627\u062b\u0629 \u0644\u0644\u0639\u0644\u0645 \u0627\u0644\u0641\u0631\u0646\u0633\u064a\u061f', explanation: '\u0627\u0644\u0639\u0644\u0645 \u064a\u062a\u0643\u0648\u0646 \u0645\u0646 \u062b\u0644\u0627\u062b \u0623\u0634\u0631\u0637\u0629: \u0623\u0632\u0631\u0642\u060c \u0623\u0628\u064a\u0636\u060c \u0623\u062d\u0645\u0631.', choices: [{ id: 'a', text: '\u0623\u0632\u0631\u0642\u060c \u0623\u0628\u064a\u0636\u060c \u0623\u062d\u0645\u0631' }, { id: 'b', text: '\u0623\u062d\u0645\u0631\u060c \u0623\u0628\u064a\u0636\u060c \u0623\u0632\u0631\u0642' }, { id: 'c', text: '\u0623\u0628\u064a\u0636\u060c \u0623\u0632\u0631\u0642\u060c \u0623\u062d\u0645\u0631' }, { id: 'd', text: '\u0623\u0632\u0631\u0642\u060c \u0623\u062d\u0645\u0631\u060c \u0623\u0628\u064a\u0636' }] },
      { lang: 'es', text: 'Cuales son los tres colores de la bandera francesa?', explanation: 'La bandera se compone de tres franjas: azul, blanco, rojo.', choices: [{ id: 'a', text: 'Azul, blanco, rojo' }, { id: 'b', text: 'Rojo, blanco, azul' }, { id: 'c', text: 'Blanco, azul, rojo' }, { id: 'd', text: 'Azul, rojo, blanco' }] },
      { lang: 'pt', text: 'Quais sao as tres cores da bandeira francesa?', explanation: 'A bandeira e composta por tres faixas: azul, branco, vermelho.', choices: [{ id: 'a', text: 'Azul, branco, vermelho' }, { id: 'b', text: 'Vermelho, branco, azul' }, { id: 'c', text: 'Branco, azul, vermelho' }, { id: 'd', text: 'Azul, vermelho, branco' }] },
    ],
  },
  {
    themeId: 1,
    type: 'knowledge',
    difficulty: 2,
    isPremium: false,
    textFr: 'Qu\'est-ce que l\'egalite devant la loi ?',
    explanationFr: 'L\'egalite devant la loi signifie que tous les citoyens ont les memes droits et les memes devoirs, sans distinction d\'origine, de race ou de religion.',
    choicesFr: [
      { id: 'a', text: 'Tous les citoyens ont les memes droits et devoirs' },
      { id: 'b', text: 'Tout le monde gagne le meme salaire' },
      { id: 'c', text: 'Chacun peut faire ce qu\'il veut' },
      { id: 'd', text: 'Seuls les Francais de naissance ont des droits' },
    ],
    correctChoice: 'a',
  },
  {
    themeId: 1,
    type: 'knowledge',
    difficulty: 1,
    isPremium: false,
    textFr: 'Quel est le regime politique de la France ?',
    explanationFr: 'La France est une Republique democratique. Le regime actuel est la Ve Republique, instauree en 1958.',
    choicesFr: [
      { id: 'a', text: 'Une republique democratique' },
      { id: 'b', text: 'Une monarchie constitutionnelle' },
      { id: 'c', text: 'Une dictature' },
      { id: 'd', text: 'Une federation' },
    ],
    correctChoice: 'a',
  },
  {
    themeId: 1,
    type: 'knowledge',
    difficulty: 2,
    isPremium: false,
    textFr: 'Qu\'est-ce que la fraternite dans la devise francaise ?',
    explanationFr: 'La fraternite est le lien de solidarite entre les citoyens. Elle implique l\'entraide et le respect mutuel.',
    choicesFr: [
      { id: 'a', text: 'La solidarite et l\'entraide entre citoyens' },
      { id: 'b', text: 'L\'obligation d\'avoir des freres et soeurs' },
      { id: 'c', text: 'Le droit de porter des armes' },
      { id: 'd', text: 'La superiorite de la France' },
    ],
    correctChoice: 'a',
  },
  {
    themeId: 1,
    type: 'knowledge',
    difficulty: 2,
    isPremium: true,
    textFr: 'Quelle loi a instaure la laicite en France ?',
    explanationFr: 'La loi du 9 decembre 1905 sur la separation des Eglises et de l\'Etat est le texte fondateur de la laicite en France.',
    choicesFr: [
      { id: 'a', text: 'La loi de 1905' },
      { id: 'b', text: 'La loi de 1789' },
      { id: 'c', text: 'La loi de 1848' },
      { id: 'd', text: 'La loi de 1958' },
    ],
    correctChoice: 'a',
  },
  {
    themeId: 1,
    type: 'situational',
    difficulty: 2,
    isPremium: false,
    textFr: 'Lors d\'une ceremonie officielle, tout le monde se leve. Pourquoi ?',
    explanationFr: 'On se leve pendant la Marseillaise par respect pour l\'hymne national et les valeurs de la Republique.',
    choicesFr: [
      { id: 'a', text: 'Par respect pour l\'hymne national' },
      { id: 'b', text: 'Parce que c\'est obligatoire par la loi' },
      { id: 'c', text: 'Pour mieux voir' },
      { id: 'd', text: 'Par habitude uniquement' },
    ],
    correctChoice: 'a',
  },

  // ── Theme 2: Systeme institutionnel et politique (id=2) ──
  {
    themeId: 2,
    type: 'knowledge',
    difficulty: 1,
    isPremium: false,
    textFr: 'Qui est le chef de l\'Etat en France ?',
    explanationFr: 'Le President de la Republique est le chef de l\'Etat. Il est elu au suffrage universel direct pour 5 ans.',
    choicesFr: [
      { id: 'a', text: 'Le President de la Republique' },
      { id: 'b', text: 'Le Premier ministre' },
      { id: 'c', text: 'Le President du Senat' },
      { id: 'd', text: 'Le President de l\'Assemblee nationale' },
    ],
    correctChoice: 'a',
    translations: [
      {
        lang: 'ar',
        text: '\u0645\u0646 \u0647\u0648 \u0631\u0626\u064a\u0633 \u0627\u0644\u062f\u0648\u0644\u0629 \u0641\u064a \u0641\u0631\u0646\u0633\u0627\u061f',
        explanation: '\u0631\u0626\u064a\u0633 \u0627\u0644\u062c\u0645\u0647\u0648\u0631\u064a\u0629 \u0647\u0648 \u0631\u0626\u064a\u0633 \u0627\u0644\u062f\u0648\u0644\u0629. \u064a\u064f\u0646\u062a\u062e\u0628 \u0628\u0627\u0644\u0627\u0642\u062a\u0631\u0627\u0639 \u0627\u0644\u0639\u0627\u0645 \u0627\u0644\u0645\u0628\u0627\u0634\u0631 \u0644\u0645\u062f\u0629 5 \u0633\u0646\u0648\u0627\u062a.',
        choices: [
          { id: 'a', text: '\u0631\u0626\u064a\u0633 \u0627\u0644\u062c\u0645\u0647\u0648\u0631\u064a\u0629' },
          { id: 'b', text: '\u0627\u0644\u0648\u0632\u064a\u0631 \u0627\u0644\u0623\u0648\u0644' },
          { id: 'c', text: '\u0631\u0626\u064a\u0633 \u0645\u062c\u0644\u0633 \u0627\u0644\u0634\u064a\u0648\u062e' },
          { id: 'd', text: '\u0631\u0626\u064a\u0633 \u0627\u0644\u062c\u0645\u0639\u064a\u0629 \u0627\u0644\u0648\u0637\u0646\u064a\u0629' },
        ],
      },
      {
        lang: 'es',
        text: 'Quien es el jefe de Estado en Francia?',
        explanation: 'El Presidente de la Republica es el jefe de Estado. Se elige por sufragio universal directo por 5 anos.',
        choices: [
          { id: 'a', text: 'El Presidente de la Republica' },
          { id: 'b', text: 'El Primer Ministro' },
          { id: 'c', text: 'El Presidente del Senado' },
          { id: 'd', text: 'El Presidente de la Asamblea Nacional' },
        ],
      },
      {
        lang: 'pt',
        text: 'Quem e o chefe de Estado na Franca?',
        explanation: 'O Presidente da Republica e o chefe de Estado. E eleito por sufragio universal direto por 5 anos.',
        choices: [
          { id: 'a', text: 'O Presidente da Republica' },
          { id: 'b', text: 'O Primeiro-Ministro' },
          { id: 'c', text: 'O Presidente do Senado' },
          { id: 'd', text: 'O Presidente da Assembleia Nacional' },
        ],
      },
    ],
  },
  {
    themeId: 2,
    type: 'knowledge',
    difficulty: 1,
    isPremium: false,
    textFr: 'Pour combien d\'annees le President de la Republique est-il elu ?',
    explanationFr: 'Le President est elu pour un mandat de 5 ans (quinquennat), renouvelable une fois.',
    choicesFr: [
      { id: 'a', text: '5 ans' },
      { id: 'b', text: '4 ans' },
      { id: 'c', text: '7 ans' },
      { id: 'd', text: '6 ans' },
    ],
    correctChoice: 'a',
    translations: [
      {
        lang: 'ar',
        text: '\u0644\u0643\u0645 \u0633\u0646\u0629 \u064a\u064f\u0646\u062a\u062e\u0628 \u0631\u0626\u064a\u0633 \u0627\u0644\u062c\u0645\u0647\u0648\u0631\u064a\u0629\u061f',
        explanation: '\u064a\u064f\u0646\u062a\u062e\u0628 \u0627\u0644\u0631\u0626\u064a\u0633 \u0644\u0645\u062f\u0629 5 \u0633\u0646\u0648\u0627\u062a \u0642\u0627\u0628\u0644\u0629 \u0644\u0644\u062a\u062c\u062f\u064a\u062f \u0645\u0631\u0629 \u0648\u0627\u062d\u062f\u0629.',
        choices: [
          { id: 'a', text: '5 \u0633\u0646\u0648\u0627\u062a' },
          { id: 'b', text: '4 \u0633\u0646\u0648\u0627\u062a' },
          { id: 'c', text: '7 \u0633\u0646\u0648\u0627\u062a' },
          { id: 'd', text: '6 \u0633\u0646\u0648\u0627\u062a' },
        ],
      },
      {
        lang: 'es',
        text: 'Por cuantos anos se elige al Presidente de la Republica?',
        explanation: 'El Presidente se elige por un mandato de 5 anos (quinquenio), renovable una vez.',
        choices: [
          { id: 'a', text: '5 anos' },
          { id: 'b', text: '4 anos' },
          { id: 'c', text: '7 anos' },
          { id: 'd', text: '6 anos' },
        ],
      },
      {
        lang: 'pt',
        text: 'Por quantos anos e eleito o Presidente da Republica?',
        explanation: 'O Presidente e eleito por um mandato de 5 anos (quinquenio), renovavel uma vez.',
        choices: [
          { id: 'a', text: '5 anos' },
          { id: 'b', text: '4 anos' },
          { id: 'c', text: '7 anos' },
          { id: 'd', text: '6 anos' },
        ],
      },
    ],
  },
  {
    themeId: 2,
    type: 'knowledge',
    difficulty: 2,
    isPremium: false,
    textFr: 'Quelles sont les deux assemblees qui composent le Parlement ?',
    explanationFr: 'Le Parlement est compose de l\'Assemblee nationale et du Senat. L\'Assemblee nationale est elue au suffrage universel direct.',
    choicesFr: [
      { id: 'a', text: 'L\'Assemblee nationale et le Senat' },
      { id: 'b', text: 'Le Conseil constitutionnel et le Senat' },
      { id: 'c', text: 'L\'Assemblee nationale et le Conseil d\'Etat' },
      { id: 'd', text: 'Le Senat et la Cour de cassation' },
    ],
    correctChoice: 'a',
    translations: [
      { lang: 'ar', text: '\u0645\u0627 \u0647\u0645\u0627 \u0627\u0644\u0645\u062c\u0644\u0633\u0627\u0646 \u0627\u0644\u0644\u0630\u0627\u0646 \u064a\u0634\u0643\u0644\u0627\u0646 \u0627\u0644\u0628\u0631\u0644\u0645\u0627\u0646\u061f', explanation: '\u0627\u0644\u0628\u0631\u0644\u0645\u0627\u0646 \u064a\u062a\u0643\u0648\u0646 \u0645\u0646 \u0627\u0644\u062c\u0645\u0639\u064a\u0629 \u0627\u0644\u0648\u0637\u0646\u064a\u0629 \u0648\u0645\u062c\u0644\u0633 \u0627\u0644\u0634\u064a\u0648\u062e.', choices: [{ id: 'a', text: '\u0627\u0644\u062c\u0645\u0639\u064a\u0629 \u0627\u0644\u0648\u0637\u0646\u064a\u0629 \u0648\u0645\u062c\u0644\u0633 \u0627\u0644\u0634\u064a\u0648\u062e' }, { id: 'b', text: '\u0627\u0644\u0645\u062c\u0644\u0633 \u0627\u0644\u062f\u0633\u062a\u0648\u0631\u064a \u0648\u0645\u062c\u0644\u0633 \u0627\u0644\u0634\u064a\u0648\u062e' }, { id: 'c', text: '\u0627\u0644\u062c\u0645\u0639\u064a\u0629 \u0627\u0644\u0648\u0637\u0646\u064a\u0629 \u0648\u0645\u062c\u0644\u0633 \u0627\u0644\u062f\u0648\u0644\u0629' }, { id: 'd', text: '\u0645\u062c\u0644\u0633 \u0627\u0644\u0634\u064a\u0648\u062e \u0648\u0645\u062d\u0643\u0645\u0629 \u0627\u0644\u0646\u0642\u0636' }] },
      { lang: 'es', text: 'Cuales son las dos camaras que componen el Parlamento?', explanation: 'El Parlamento se compone de la Asamblea Nacional y el Senado.', choices: [{ id: 'a', text: 'La Asamblea Nacional y el Senado' }, { id: 'b', text: 'El Consejo Constitucional y el Senado' }, { id: 'c', text: 'La Asamblea Nacional y el Consejo de Estado' }, { id: 'd', text: 'El Senado y el Tribunal de Casacion' }] },
      { lang: 'pt', text: 'Quais sao as duas assembleias que compoem o Parlamento?', explanation: 'O Parlamento e composto pela Assembleia Nacional e pelo Senado.', choices: [{ id: 'a', text: 'A Assembleia Nacional e o Senado' }, { id: 'b', text: 'O Conselho Constitucional e o Senado' }, { id: 'c', text: 'A Assembleia Nacional e o Conselho de Estado' }, { id: 'd', text: 'O Senado e o Tribunal de Cassacao' }] },
    ],
  },
  {
    themeId: 2,
    type: 'knowledge',
    difficulty: 2,
    isPremium: false,
    textFr: 'Qui nomme le Premier ministre ?',
    explanationFr: 'Le President de la Republique nomme le Premier ministre.',
    choicesFr: [
      { id: 'a', text: 'Le President de la Republique' },
      { id: 'b', text: 'L\'Assemblee nationale' },
      { id: 'c', text: 'Le Senat' },
      { id: 'd', text: 'Le peuple par referendum' },
    ],
    correctChoice: 'a',
  },
  {
    themeId: 2,
    type: 'knowledge',
    difficulty: 2,
    isPremium: false,
    textFr: 'Quel est le role du Conseil constitutionnel ?',
    explanationFr: 'Le Conseil constitutionnel verifie que les lois sont conformes a la Constitution. Il est compose de 9 membres.',
    choicesFr: [
      { id: 'a', text: 'Verifier la conformite des lois a la Constitution' },
      { id: 'b', text: 'Diriger l\'armee' },
      { id: 'c', text: 'Gerer le budget de l\'Etat' },
      { id: 'd', text: 'Nommer les deputes' },
    ],
    correctChoice: 'a',
  },
  {
    themeId: 2,
    type: 'knowledge',
    difficulty: 1,
    isPremium: false,
    textFr: 'Qui vote les lois en France ?',
    explanationFr: 'Les lois sont votees par le Parlement, compose de l\'Assemblee nationale et du Senat.',
    choicesFr: [
      { id: 'a', text: 'Le Parlement (Assemblee nationale et Senat)' },
      { id: 'b', text: 'Le President de la Republique seul' },
      { id: 'c', text: 'Les maires des communes' },
      { id: 'd', text: 'Le Conseil constitutionnel' },
    ],
    correctChoice: 'a',
    translations: [
      { lang: 'ar', text: '\u0645\u0646 \u064a\u0635\u0648\u062a \u0639\u0644\u0649 \u0627\u0644\u0642\u0648\u0627\u0646\u064a\u0646 \u0641\u064a \u0641\u0631\u0646\u0633\u0627\u061f', explanation: '\u0627\u0644\u0642\u0648\u0627\u0646\u064a\u0646 \u064a\u0635\u0648\u062a \u0639\u0644\u064a\u0647\u0627 \u0627\u0644\u0628\u0631\u0644\u0645\u0627\u0646.', choices: [{ id: 'a', text: '\u0627\u0644\u0628\u0631\u0644\u0645\u0627\u0646' }, { id: 'b', text: '\u0631\u0626\u064a\u0633 \u0627\u0644\u062c\u0645\u0647\u0648\u0631\u064a\u0629 \u0648\u062d\u062f\u0647' }, { id: 'c', text: '\u0631\u0624\u0633\u0627\u0621 \u0627\u0644\u0628\u0644\u062f\u064a\u0627\u062a' }, { id: 'd', text: '\u0627\u0644\u0645\u062c\u0644\u0633 \u0627\u0644\u062f\u0633\u062a\u0648\u0631\u064a' }] },
      { lang: 'es', text: 'Quien vota las leyes en Francia?', explanation: 'Las leyes son votadas por el Parlamento.', choices: [{ id: 'a', text: 'El Parlamento' }, { id: 'b', text: 'El Presidente solo' }, { id: 'c', text: 'Los alcaldes' }, { id: 'd', text: 'El Consejo Constitucional' }] },
      { lang: 'pt', text: 'Quem vota as leis na Franca?', explanation: 'As leis sao votadas pelo Parlamento.', choices: [{ id: 'a', text: 'O Parlamento' }, { id: 'b', text: 'O Presidente sozinho' }, { id: 'c', text: 'Os prefeitos' }, { id: 'd', text: 'O Conselho Constitucional' }] },
    ],
  },
  {
    themeId: 2,
    type: 'knowledge',
    difficulty: 2,
    isPremium: false,
    textFr: 'Qu\'est-ce qu\'une commune en France ?',
    explanationFr: 'La commune est la plus petite division administrative de la France. Elle est dirigee par un maire et un conseil municipal.',
    choicesFr: [
      { id: 'a', text: 'La plus petite division administrative, dirigee par un maire' },
      { id: 'b', text: 'Une region dirigee par un prefet' },
      { id: 'c', text: 'Un departement dirige par un president' },
      { id: 'd', text: 'Un territoire d\'outre-mer' },
    ],
    correctChoice: 'a',
  },
  {
    themeId: 2,
    type: 'knowledge',
    difficulty: 2,
    isPremium: true,
    textFr: 'Qu\'est-ce que le suffrage universel direct ?',
    explanationFr: 'Le suffrage universel direct signifie que tous les citoyens en age de voter elisent directement leurs representants.',
    choicesFr: [
      { id: 'a', text: 'Tous les citoyens votent directement pour leurs representants' },
      { id: 'b', text: 'Seuls les riches peuvent voter' },
      { id: 'c', text: 'Les representants sont nommes par le roi' },
      { id: 'd', text: 'Seuls les hommes peuvent voter' },
    ],
    correctChoice: 'a',
  },
  {
    themeId: 2,
    type: 'knowledge',
    difficulty: 3,
    isPremium: true,
    textFr: 'Quel article de la Constitution definit la France comme une Republique laique ?',
    explanationFr: 'L\'article premier de la Constitution de 1958 dispose que la France est une Republique indivisible, laique, democratique et sociale.',
    choicesFr: [
      { id: 'a', text: 'L\'article 1er' },
      { id: 'b', text: 'L\'article 5' },
      { id: 'c', text: 'L\'article 16' },
      { id: 'd', text: 'L\'article 49' },
    ],
    correctChoice: 'a',
  },
  {
    themeId: 2,
    type: 'knowledge',
    difficulty: 2,
    isPremium: false,
    textFr: 'A quel age peut-on voter en France ?',
    explanationFr: 'Le droit de vote s\'acquiert a 18 ans, age de la majorite civile en France.',
    choicesFr: [
      { id: 'a', text: '18 ans' },
      { id: 'b', text: '16 ans' },
      { id: 'c', text: '21 ans' },
      { id: 'd', text: '25 ans' },
    ],
    correctChoice: 'a',
    translations: [
      { lang: 'ar', text: '\u0641\u064a \u0623\u064a \u0633\u0646 \u064a\u0645\u0643\u0646 \u0627\u0644\u062a\u0635\u0648\u064a\u062a \u0641\u064a \u0641\u0631\u0646\u0633\u0627\u061f', explanation: '\u062d\u0642 \u0627\u0644\u062a\u0635\u0648\u064a\u062a \u064a\u0628\u062f\u0623 \u0639\u0646\u062f 18 \u0633\u0646\u0629.', choices: [{ id: 'a', text: '18 \u0633\u0646\u0629' }, { id: 'b', text: '16 \u0633\u0646\u0629' }, { id: 'c', text: '21 \u0633\u0646\u0629' }, { id: 'd', text: '25 \u0633\u0646\u0629' }] },
      { lang: 'es', text: 'A que edad se puede votar en Francia?', explanation: 'El derecho a votar se adquiere a los 18 anos.', choices: [{ id: 'a', text: '18 anos' }, { id: 'b', text: '16 anos' }, { id: 'c', text: '21 anos' }, { id: 'd', text: '25 anos' }] },
      { lang: 'pt', text: 'Com que idade se pode votar na Franca?', explanation: 'O direito de voto adquire-se aos 18 anos.', choices: [{ id: 'a', text: '18 anos' }, { id: 'b', text: '16 anos' }, { id: 'c', text: '21 anos' }, { id: 'd', text: '25 anos' }] },
    ],
  },

  // ── Theme 3: Droits et devoirs (id=3) ──
  {
    themeId: 3,
    type: 'knowledge',
    difficulty: 1,
    isPremium: false,
    textFr: 'L\'ecole est-elle obligatoire en France ? Si oui, de quel age a quel age ?',
    explanationFr: 'L\'instruction est obligatoire de 3 a 16 ans en France. L\'ecole publique est gratuite et laique.',
    choicesFr: [
      { id: 'a', text: 'Oui, de 3 a 16 ans' },
      { id: 'b', text: 'Oui, de 6 a 14 ans' },
      { id: 'c', text: 'Non, l\'ecole n\'est pas obligatoire' },
      { id: 'd', text: 'Oui, de 5 a 18 ans' },
    ],
    correctChoice: 'a',
    translations: [
      {
        lang: 'ar',
        text: '\u0647\u0644 \u0627\u0644\u0645\u062f\u0631\u0633\u0629 \u0625\u0644\u0632\u0627\u0645\u064a\u0629 \u0641\u064a \u0641\u0631\u0646\u0633\u0627\u061f \u0645\u0646 \u0623\u064a \u0633\u0646 \u0625\u0644\u0649 \u0623\u064a \u0633\u0646\u061f',
        explanation: '\u0627\u0644\u062a\u0639\u0644\u064a\u0645 \u0625\u0644\u0632\u0627\u0645\u064a \u0645\u0646 3 \u0625\u0644\u0649 16 \u0633\u0646\u0629. \u0627\u0644\u0645\u062f\u0631\u0633\u0629 \u0627\u0644\u0639\u0627\u0645\u0629 \u0645\u062c\u0627\u0646\u064a\u0629 \u0648\u0639\u0644\u0645\u0627\u0646\u064a\u0629.',
        choices: [
          { id: 'a', text: '\u0646\u0639\u0645\u060c \u0645\u0646 3 \u0625\u0644\u0649 16 \u0633\u0646\u0629' },
          { id: 'b', text: '\u0646\u0639\u0645\u060c \u0645\u0646 6 \u0625\u0644\u0649 14 \u0633\u0646\u0629' },
          { id: 'c', text: '\u0644\u0627\u060c \u0627\u0644\u0645\u062f\u0631\u0633\u0629 \u0644\u064a\u0633\u062a \u0625\u0644\u0632\u0627\u0645\u064a\u0629' },
          { id: 'd', text: '\u0646\u0639\u0645\u060c \u0645\u0646 5 \u0625\u0644\u0649 18 \u0633\u0646\u0629' },
        ],
      },
      {
        lang: 'es',
        text: 'Es obligatoria la escuela en Francia? De que edad a que edad?',
        explanation: 'La instruccion es obligatoria de 3 a 16 anos. La escuela publica es gratuita y laica.',
        choices: [
          { id: 'a', text: 'Si, de 3 a 16 anos' },
          { id: 'b', text: 'Si, de 6 a 14 anos' },
          { id: 'c', text: 'No, la escuela no es obligatoria' },
          { id: 'd', text: 'Si, de 5 a 18 anos' },
        ],
      },
      {
        lang: 'pt',
        text: 'A escola e obrigatoria na Franca? De que idade a que idade?',
        explanation: 'A instrucao e obrigatoria dos 3 aos 16 anos. A escola publica e gratuita e laica.',
        choices: [
          { id: 'a', text: 'Sim, dos 3 aos 16 anos' },
          { id: 'b', text: 'Sim, dos 6 aos 14 anos' },
          { id: 'c', text: 'Nao, a escola nao e obrigatoria' },
          { id: 'd', text: 'Sim, dos 5 aos 18 anos' },
        ],
      },
    ],
  },
  {
    themeId: 3,
    type: 'knowledge',
    difficulty: 1,
    isPremium: false,
    textFr: 'Est-il obligatoire de payer des impots en France ?',
    explanationFr: 'Oui, payer des impots est un devoir civique. Les impots financent les services publics (ecoles, hopitaux, routes, etc.).',
    choicesFr: [
      { id: 'a', text: 'Oui, c\'est un devoir civique' },
      { id: 'b', text: 'Non, c\'est facultatif' },
      { id: 'c', text: 'Seulement pour les riches' },
      { id: 'd', text: 'Seulement pour les etrangers' },
    ],
    correctChoice: 'a',
    translations: [
      {
        lang: 'ar',
        text: '\u0647\u0644 \u062f\u0641\u0639 \u0627\u0644\u0636\u0631\u0627\u0626\u0628 \u0625\u0644\u0632\u0627\u0645\u064a \u0641\u064a \u0641\u0631\u0646\u0633\u0627\u061f',
        explanation: '\u0646\u0639\u0645\u060c \u062f\u0641\u0639 \u0627\u0644\u0636\u0631\u0627\u0626\u0628 \u0648\u0627\u062c\u0628 \u0645\u062f\u0646\u064a. \u062a\u0645\u0648\u0644 \u0627\u0644\u0636\u0631\u0627\u0626\u0628 \u0627\u0644\u062e\u062f\u0645\u0627\u062a \u0627\u0644\u0639\u0627\u0645\u0629.',
        choices: [
          { id: 'a', text: '\u0646\u0639\u0645\u060c \u0625\u0646\u0647 \u0648\u0627\u062c\u0628 \u0645\u062f\u0646\u064a' },
          { id: 'b', text: '\u0644\u0627\u060c \u0625\u0646\u0647 \u0627\u062e\u062a\u064a\u0627\u0631\u064a' },
          { id: 'c', text: '\u0641\u0642\u0637 \u0644\u0644\u0623\u063a\u0646\u064a\u0627\u0621' },
          { id: 'd', text: '\u0641\u0642\u0637 \u0644\u0644\u0623\u062c\u0627\u0646\u0628' },
        ],
      },
      {
        lang: 'es',
        text: 'Es obligatorio pagar impuestos en Francia?',
        explanation: 'Si, pagar impuestos es un deber civico. Los impuestos financian los servicios publicos.',
        choices: [
          { id: 'a', text: 'Si, es un deber civico' },
          { id: 'b', text: 'No, es opcional' },
          { id: 'c', text: 'Solo para los ricos' },
          { id: 'd', text: 'Solo para los extranjeros' },
        ],
      },
      {
        lang: 'pt',
        text: 'E obrigatorio pagar impostos na Franca?',
        explanation: 'Sim, pagar impostos e um dever civico. Os impostos financiam os servicos publicos.',
        choices: [
          { id: 'a', text: 'Sim, e um dever civico' },
          { id: 'b', text: 'Nao, e opcional' },
          { id: 'c', text: 'Apenas para os ricos' },
          { id: 'd', text: 'Apenas para os estrangeiros' },
        ],
      },
    ],
  },
  {
    themeId: 3,
    type: 'knowledge',
    difficulty: 2,
    isPremium: false,
    textFr: 'Quel texte garantit les droits fondamentaux en France ?',
    explanationFr: 'La Declaration des Droits de l\'Homme et du Citoyen de 1789, integree au bloc de constitutionnalite, garantit les droits fondamentaux.',
    choicesFr: [
      { id: 'a', text: 'La Declaration des Droits de l\'Homme et du Citoyen de 1789' },
      { id: 'b', text: 'Le Code civil de 1804' },
      { id: 'c', text: 'Le traite de Versailles' },
      { id: 'd', text: 'La charte de l\'ONU' },
    ],
    correctChoice: 'a',
    translations: [
      { lang: 'ar', text: '\u0645\u0627 \u0647\u0648 \u0627\u0644\u0646\u0635 \u0627\u0644\u0630\u064a \u064a\u0636\u0645\u0646 \u0627\u0644\u062d\u0642\u0648\u0642 \u0627\u0644\u0623\u0633\u0627\u0633\u064a\u0629 \u0641\u064a \u0641\u0631\u0646\u0633\u0627\u061f', explanation: '\u0625\u0639\u0644\u0627\u0646 \u062d\u0642\u0648\u0642 \u0627\u0644\u0625\u0646\u0633\u0627\u0646 \u0648\u0627\u0644\u0645\u0648\u0627\u0637\u0646 1789.', choices: [{ id: 'a', text: '\u0625\u0639\u0644\u0627\u0646 \u062d\u0642\u0648\u0642 \u0627\u0644\u0625\u0646\u0633\u0627\u0646 \u0648\u0627\u0644\u0645\u0648\u0627\u0637\u0646 1789' }, { id: 'b', text: '\u0627\u0644\u0642\u0627\u0646\u0648\u0646 \u0627\u0644\u0645\u062f\u0646\u064a 1804' }, { id: 'c', text: '\u0645\u0639\u0627\u0647\u062f\u0629 \u0641\u0631\u0633\u0627\u064a' }, { id: 'd', text: '\u0645\u064a\u062b\u0627\u0642 \u0627\u0644\u0623\u0645\u0645 \u0627\u0644\u0645\u062a\u062d\u062f\u0629' }] },
      { lang: 'es', text: 'Que texto garantiza los derechos fundamentales en Francia?', explanation: 'La Declaracion de los Derechos del Hombre y del Ciudadano de 1789.', choices: [{ id: 'a', text: 'Declaracion de los Derechos del Hombre y del Ciudadano 1789' }, { id: 'b', text: 'Codigo civil de 1804' }, { id: 'c', text: 'Tratado de Versalles' }, { id: 'd', text: 'Carta de la ONU' }] },
      { lang: 'pt', text: 'Qual texto garante os direitos fundamentais na Franca?', explanation: 'A Declaracao dos Direitos do Homem e do Cidadao de 1789.', choices: [{ id: 'a', text: 'Declaracao dos Direitos do Homem e do Cidadao 1789' }, { id: 'b', text: 'Codigo civil de 1804' }, { id: 'c', text: 'Tratado de Versalhes' }, { id: 'd', text: 'Carta da ONU' }] },
    ],
  },
  {
    themeId: 3,
    type: 'knowledge',
    difficulty: 1,
    isPremium: false,
    textFr: 'La liberte d\'expression est-elle un droit en France ?',
    explanationFr: 'Oui, la liberte d\'expression est un droit fondamental garanti par la Declaration de 1789 et la Constitution. Elle a des limites (diffamation, incitation a la haine).',
    choicesFr: [
      { id: 'a', text: 'Oui, c\'est un droit fondamental avec certaines limites' },
      { id: 'b', text: 'Non, seul l\'Etat peut s\'exprimer' },
      { id: 'c', text: 'Oui, sans aucune limite' },
      { id: 'd', text: 'Seulement pour les journalistes' },
    ],
    correctChoice: 'a',
    translations: [
      { lang: 'ar', text: '\u0647\u0644 \u062d\u0631\u064a\u0629 \u0627\u0644\u062a\u0639\u0628\u064a\u0631 \u062d\u0642 \u0641\u064a \u0641\u0631\u0646\u0633\u0627\u061f', explanation: '\u0646\u0639\u0645\u060c \u062d\u0631\u064a\u0629 \u0627\u0644\u062a\u0639\u0628\u064a\u0631 \u062d\u0642 \u0623\u0633\u0627\u0633\u064a \u0645\u0639 \u0628\u0639\u0636 \u0627\u0644\u0642\u064a\u0648\u062f.', choices: [{ id: 'a', text: '\u0646\u0639\u0645\u060c \u062d\u0642 \u0623\u0633\u0627\u0633\u064a \u0645\u0639 \u0642\u064a\u0648\u062f' }, { id: 'b', text: '\u0644\u0627\u060c \u0641\u0642\u0637 \u0627\u0644\u062f\u0648\u0644\u0629' }, { id: 'c', text: '\u0646\u0639\u0645\u060c \u0628\u062f\u0648\u0646 \u0642\u064a\u0648\u062f' }, { id: 'd', text: '\u0641\u0642\u0637 \u0644\u0644\u0635\u062d\u0641\u064a\u064a\u0646' }] },
      { lang: 'es', text: 'La libertad de expresion es un derecho en Francia?', explanation: 'Si, es un derecho fundamental con ciertos limites.', choices: [{ id: 'a', text: 'Si, un derecho fundamental con limites' }, { id: 'b', text: 'No, solo el Estado' }, { id: 'c', text: 'Si, sin limites' }, { id: 'd', text: 'Solo para periodistas' }] },
      { lang: 'pt', text: 'A liberdade de expressao e um direito na Franca?', explanation: 'Sim, e um direito fundamental com certos limites.', choices: [{ id: 'a', text: 'Sim, um direito fundamental com limites' }, { id: 'b', text: 'Nao, so o Estado' }, { id: 'c', text: 'Sim, sem limites' }, { id: 'd', text: 'Apenas para jornalistas' }] },
    ],
  },
  {
    themeId: 3,
    type: 'knowledge',
    difficulty: 2,
    isPremium: false,
    textFr: 'Quels sont les devoirs du citoyen francais ?',
    explanationFr: 'Les devoirs incluent : respecter les lois, payer les impots, participer a la defense nationale, et voter (devoir moral).',
    choicesFr: [
      { id: 'a', text: 'Respecter les lois, payer les impots, participer a la defense' },
      { id: 'b', text: 'Seulement payer les impots' },
      { id: 'c', text: 'Aller a l\'eglise le dimanche' },
      { id: 'd', text: 'Parler uniquement francais' },
    ],
    correctChoice: 'a',
  },
  {
    themeId: 3,
    type: 'knowledge',
    difficulty: 2,
    isPremium: false,
    textFr: 'Qu\'est-ce que le droit d\'asile ?',
    explanationFr: 'Le droit d\'asile permet a une personne persecutee dans son pays de demander la protection de la France.',
    choicesFr: [
      { id: 'a', text: 'Le droit de demander protection contre les persecutions' },
      { id: 'b', text: 'Le droit de vivre dans n\'importe quel pays' },
      { id: 'c', text: 'Le droit de changer de nationalite facilement' },
      { id: 'd', text: 'Le droit de ne pas travailler' },
    ],
    correctChoice: 'a',
  },
  {
    themeId: 3,
    type: 'knowledge',
    difficulty: 2,
    isPremium: false,
    textFr: 'En France, les hommes et les femmes ont-ils les memes droits ?',
    explanationFr: 'Oui, l\'egalite entre les femmes et les hommes est un principe constitutionnel. Le droit de vote des femmes date de 1944.',
    choicesFr: [
      { id: 'a', text: 'Oui, l\'egalite est un principe constitutionnel' },
      { id: 'b', text: 'Non, les hommes ont plus de droits' },
      { id: 'c', text: 'Seulement dans certaines regions' },
      { id: 'd', text: 'Seulement depuis 2000' },
    ],
    correctChoice: 'a',
    translations: [
      { lang: 'ar', text: '\u0647\u0644 \u0644\u0644\u0631\u062c\u0627\u0644 \u0648\u0627\u0644\u0646\u0633\u0627\u0621 \u0646\u0641\u0633 \u0627\u0644\u062d\u0642\u0648\u0642 \u0641\u064a \u0641\u0631\u0646\u0633\u0627\u061f', explanation: '\u0646\u0639\u0645\u060c \u0627\u0644\u0645\u0633\u0627\u0648\u0627\u0629 \u0645\u0628\u062f\u0623 \u062f\u0633\u062a\u0648\u0631\u064a.', choices: [{ id: 'a', text: '\u0646\u0639\u0645\u060c \u0627\u0644\u0645\u0633\u0627\u0648\u0627\u0629 \u0645\u0628\u062f\u0623 \u062f\u0633\u062a\u0648\u0631\u064a' }, { id: 'b', text: '\u0644\u0627\u060c \u0627\u0644\u0631\u062c\u0627\u0644 \u0644\u062f\u064a\u0647\u0645 \u062d\u0642\u0648\u0642 \u0623\u0643\u062b\u0631' }, { id: 'c', text: '\u0641\u0642\u0637 \u0641\u064a \u0628\u0639\u0636 \u0627\u0644\u0645\u0646\u0627\u0637\u0642' }, { id: 'd', text: '\u0641\u0642\u0637 \u0645\u0646\u0630 2000' }] },
      { lang: 'es', text: 'Hombres y mujeres tienen los mismos derechos en Francia?', explanation: 'Si, la igualdad es un principio constitucional.', choices: [{ id: 'a', text: 'Si, la igualdad es constitucional' }, { id: 'b', text: 'No, los hombres tienen mas derechos' }, { id: 'c', text: 'Solo en algunas regiones' }, { id: 'd', text: 'Solo desde 2000' }] },
      { lang: 'pt', text: 'Homens e mulheres tem os mesmos direitos na Franca?', explanation: 'Sim, a igualdade e um principio constitucional.', choices: [{ id: 'a', text: 'Sim, a igualdade e constitucional' }, { id: 'b', text: 'Nao, os homens tem mais direitos' }, { id: 'c', text: 'Apenas em algumas regioes' }, { id: 'd', text: 'Apenas desde 2000' }] },
    ],
  },
  {
    themeId: 3,
    type: 'knowledge',
    difficulty: 2,
    isPremium: true,
    textFr: 'Qu\'est-ce que la presomption d\'innocence ?',
    explanationFr: 'La presomption d\'innocence signifie que toute personne est consideree innocente jusqu\'a ce que sa culpabilite soit prouvee.',
    choicesFr: [
      { id: 'a', text: 'Toute personne est innocente jusqu\'a preuve du contraire' },
      { id: 'b', text: 'Toute personne accusee est coupable' },
      { id: 'c', text: 'Seuls les juges sont innocents' },
      { id: 'd', text: 'On n\'a pas besoin de preuves pour condamner' },
    ],
    correctChoice: 'a',
  },
  {
    themeId: 3,
    type: 'knowledge',
    difficulty: 2,
    isPremium: false,
    textFr: 'La Journee defense et citoyennete (JDC) est-elle obligatoire ?',
    explanationFr: 'Oui, la JDC est obligatoire pour tous les jeunes francais, filles et garcons, entre 16 et 25 ans.',
    choicesFr: [
      { id: 'a', text: 'Oui, pour tous les jeunes entre 16 et 25 ans' },
      { id: 'b', text: 'Non, elle est facultative' },
      { id: 'c', text: 'Seulement pour les garcons' },
      { id: 'd', text: 'Seulement en temps de guerre' },
    ],
    correctChoice: 'a',
  },
  {
    themeId: 3,
    type: 'situational',
    difficulty: 2,
    isPremium: false,
    textFr: 'Votre voisin fait du bruit toutes les nuits. Que devez-vous faire ?',
    explanationFr: 'En cas de troubles du voisinage, il faut d\'abord tenter un dialogue, puis contacter la mairie ou la police si le probleme persiste. Le respect mutuel est un devoir.',
    choicesFr: [
      { id: 'a', text: 'Dialoguer, puis contacter la mairie ou la police' },
      { id: 'b', text: 'Faire encore plus de bruit en retour' },
      { id: 'c', text: 'Ne rien faire, ce n\'est pas grave' },
      { id: 'd', text: 'Demenager immediatement' },
    ],
    correctChoice: 'a',
  },

  // ── Theme 4: Histoire, geographie et culture (id=4) ──
  {
    themeId: 4,
    type: 'knowledge',
    difficulty: 1,
    isPremium: false,
    textFr: 'Quelle est la date de la fete nationale francaise ?',
    explanationFr: 'Le 14 juillet est la fete nationale. Elle commemore la prise de la Bastille en 1789 et la Fete de la Federation de 1790.',
    choicesFr: [
      { id: 'a', text: 'Le 14 juillet' },
      { id: 'b', text: 'Le 11 novembre' },
      { id: 'c', text: 'Le 8 mai' },
      { id: 'd', text: 'Le 1er janvier' },
    ],
    correctChoice: 'a',
    translations: [
      {
        lang: 'ar',
        text: '\u0645\u0627 \u0647\u0648 \u062a\u0627\u0631\u064a\u062e \u0627\u0644\u0639\u064a\u062f \u0627\u0644\u0648\u0637\u0646\u064a \u0627\u0644\u0641\u0631\u0646\u0633\u064a\u061f',
        explanation: '14 \u064a\u0648\u0644\u064a\u0648 \u0647\u0648 \u0627\u0644\u0639\u064a\u062f \u0627\u0644\u0648\u0637\u0646\u064a. \u064a\u062d\u064a\u064a \u0630\u0643\u0631\u0649 \u0633\u0642\u0648\u0637 \u0627\u0644\u0628\u0627\u0633\u062a\u064a\u0644 \u0639\u0627\u0645 1789.',
        choices: [
          { id: 'a', text: '14 \u064a\u0648\u0644\u064a\u0648' },
          { id: 'b', text: '11 \u0646\u0648\u0641\u0645\u0628\u0631' },
          { id: 'c', text: '8 \u0645\u0627\u064a\u0648' },
          { id: 'd', text: '1 \u064a\u0646\u0627\u064a\u0631' },
        ],
      },
      {
        lang: 'es',
        text: 'Cual es la fecha de la fiesta nacional francesa?',
        explanation: 'El 14 de julio es la fiesta nacional. Conmemora la toma de la Bastilla en 1789.',
        choices: [
          { id: 'a', text: 'El 14 de julio' },
          { id: 'b', text: 'El 11 de noviembre' },
          { id: 'c', text: 'El 8 de mayo' },
          { id: 'd', text: 'El 1 de enero' },
        ],
      },
      {
        lang: 'pt',
        text: 'Qual e a data do feriado nacional frances?',
        explanation: '14 de julho e o feriado nacional. Comemora a tomada da Bastilha em 1789.',
        choices: [
          { id: 'a', text: '14 de julho' },
          { id: 'b', text: '11 de novembro' },
          { id: 'c', text: '8 de maio' },
          { id: 'd', text: '1 de janeiro' },
        ],
      },
    ],
  },
  {
    themeId: 4,
    type: 'knowledge',
    difficulty: 1,
    isPremium: false,
    textFr: 'Que s\'est-il passe le 14 juillet 1789 ?',
    explanationFr: 'Le 14 juillet 1789, le peuple de Paris a pris la Bastille, une prison royale. Cet evenement marque le debut de la Revolution francaise.',
    choicesFr: [
      { id: 'a', text: 'La prise de la Bastille' },
      { id: 'b', text: 'La signature de la Constitution' },
      { id: 'c', text: 'L\'election du premier President' },
      { id: 'd', text: 'La fin de la Seconde Guerre mondiale' },
    ],
    correctChoice: 'a',
    translations: [
      { lang: 'ar', text: '\u0645\u0627\u0630\u0627 \u062d\u062f\u062b \u0641\u064a 14 \u064a\u0648\u0644\u064a\u0648 1789\u061f', explanation: '\u0627\u0642\u062a\u062d\u0645 \u0634\u0639\u0628 \u0628\u0627\u0631\u064a\u0633 \u0633\u062c\u0646 \u0627\u0644\u0628\u0627\u0633\u062a\u064a\u0644.', choices: [{ id: 'a', text: '\u0627\u0642\u062a\u062d\u0627\u0645 \u0627\u0644\u0628\u0627\u0633\u062a\u064a\u0644' }, { id: 'b', text: '\u062a\u0648\u0642\u064a\u0639 \u0627\u0644\u062f\u0633\u062a\u0648\u0631' }, { id: 'c', text: '\u0627\u0646\u062a\u062e\u0627\u0628 \u0623\u0648\u0644 \u0631\u0626\u064a\u0633' }, { id: 'd', text: '\u0646\u0647\u0627\u064a\u0629 \u0627\u0644\u062d\u0631\u0628 \u0627\u0644\u0639\u0627\u0644\u0645\u064a\u0629 \u0627\u0644\u062b\u0627\u0646\u064a\u0629' }] },
      { lang: 'es', text: 'Que ocurrio el 14 de julio de 1789?', explanation: 'El pueblo de Paris tomo la Bastilla.', choices: [{ id: 'a', text: 'La toma de la Bastilla' }, { id: 'b', text: 'La firma de la Constitucion' }, { id: 'c', text: 'La eleccion del primer Presidente' }, { id: 'd', text: 'El fin de la Segunda Guerra Mundial' }] },
      { lang: 'pt', text: 'O que aconteceu em 14 de julho de 1789?', explanation: 'O povo de Paris tomou a Bastilha.', choices: [{ id: 'a', text: 'A tomada da Bastilha' }, { id: 'b', text: 'A assinatura da Constituicao' }, { id: 'c', text: 'A eleicao do primeiro Presidente' }, { id: 'd', text: 'O fim da Segunda Guerra Mundial' }] },
    ],
  },
  {
    themeId: 4,
    type: 'knowledge',
    difficulty: 2,
    isPremium: false,
    textFr: 'Qu\'est-ce que les Lumieres (XVIIIe siecle) ?',
    explanationFr: 'Les Lumieres sont un mouvement intellectuel du XVIIIe siecle. Voltaire, Rousseau et Montesquieu en sont les principales figures.',
    choicesFr: [
      { id: 'a', text: 'Un mouvement intellectuel pronant la raison et la liberte' },
      { id: 'b', text: 'Une invention scientifique' },
      { id: 'c', text: 'Un mouvement artistique du XIXe siecle' },
      { id: 'd', text: 'Une fete religieuse' },
    ],
    correctChoice: 'a',
  },
  {
    themeId: 4,
    type: 'knowledge',
    difficulty: 2,
    isPremium: false,
    textFr: 'Que commemore le 11 novembre en France ?',
    explanationFr: 'Le 11 novembre 1918 marque l\'armistice de la Premiere Guerre mondiale. C\'est un jour ferie en memoire des soldats morts au combat.',
    choicesFr: [
      { id: 'a', text: 'L\'armistice de la Premiere Guerre mondiale' },
      { id: 'b', text: 'La fin de la Seconde Guerre mondiale' },
      { id: 'c', text: 'La Revolution francaise' },
      { id: 'd', text: 'L\'abolition de l\'esclavage' },
    ],
    correctChoice: 'a',
    translations: [
      { lang: 'ar', text: '\u0645\u0627\u0630\u0627 \u064a\u062d\u064a\u064a 11 \u0646\u0648\u0641\u0645\u0628\u0631 \u0641\u064a \u0641\u0631\u0646\u0633\u0627\u061f', explanation: '\u0647\u062f\u0646\u0629 \u0627\u0644\u062d\u0631\u0628 \u0627\u0644\u0639\u0627\u0644\u0645\u064a\u0629 \u0627\u0644\u0623\u0648\u0644\u0649.', choices: [{ id: 'a', text: '\u0647\u062f\u0646\u0629 \u0627\u0644\u062d\u0631\u0628 \u0627\u0644\u0639\u0627\u0644\u0645\u064a\u0629 \u0627\u0644\u0623\u0648\u0644\u0649' }, { id: 'b', text: '\u0646\u0647\u0627\u064a\u0629 \u0627\u0644\u062d\u0631\u0628 \u0627\u0644\u062b\u0627\u0646\u064a\u0629' }, { id: 'c', text: '\u0627\u0644\u062b\u0648\u0631\u0629 \u0627\u0644\u0641\u0631\u0646\u0633\u064a\u0629' }, { id: 'd', text: '\u0625\u0644\u063a\u0627\u0621 \u0627\u0644\u0639\u0628\u0648\u062f\u064a\u0629' }] },
      { lang: 'es', text: 'Que conmemora el 11 de noviembre en Francia?', explanation: 'El armisticio de la Primera Guerra Mundial.', choices: [{ id: 'a', text: 'El armisticio de la Primera Guerra Mundial' }, { id: 'b', text: 'El fin de la Segunda Guerra Mundial' }, { id: 'c', text: 'La Revolucion Francesa' }, { id: 'd', text: 'La abolicion de la esclavitud' }] },
      { lang: 'pt', text: 'O que comemora o 11 de novembro na Franca?', explanation: 'O armisticio da Primeira Guerra Mundial.', choices: [{ id: 'a', text: 'O armisticio da Primeira Guerra Mundial' }, { id: 'b', text: 'O fim da Segunda Guerra Mundial' }, { id: 'c', text: 'A Revolucao Francesa' }, { id: 'd', text: 'A abolicao da escravatura' }] },
    ],
  },
  {
    themeId: 4,
    type: 'knowledge',
    difficulty: 2,
    isPremium: false,
    textFr: 'Que commemore le 8 mai en France ?',
    explanationFr: 'Le 8 mai 1945 marque la fin de la Seconde Guerre mondiale en Europe (victoire des Allies).',
    choicesFr: [
      { id: 'a', text: 'La fin de la Seconde Guerre mondiale en Europe' },
      { id: 'b', text: 'La prise de la Bastille' },
      { id: 'c', text: 'La creation de l\'Union europeenne' },
      { id: 'd', text: 'L\'election du premier President' },
    ],
    correctChoice: 'a',
  },
  {
    themeId: 4,
    type: 'knowledge',
    difficulty: 2,
    isPremium: false,
    textFr: 'Combien de regions la France metropolitaine compte-t-elle ?',
    explanationFr: 'Depuis 2016, la France metropolitaine compte 13 regions. Avec les outre-mer, on compte 18 regions au total.',
    choicesFr: [
      { id: 'a', text: '13 regions' },
      { id: 'b', text: '22 regions' },
      { id: 'c', text: '26 regions' },
      { id: 'd', text: '10 regions' },
    ],
    correctChoice: 'a',
    translations: [
      { lang: 'ar', text: '\u0643\u0645 \u0639\u062f\u062f \u0645\u0646\u0627\u0637\u0642 \u0641\u0631\u0646\u0633\u0627 \u0627\u0644\u0645\u062a\u0631\u0648\u0628\u0648\u0644\u064a\u062a\u064a\u0629\u061f', explanation: '\u0645\u0646\u0630 2016\u060c 13 \u0645\u0646\u0637\u0642\u0629 \u0645\u062a\u0631\u0648\u0628\u0648\u0644\u064a\u062a\u064a\u0629.', choices: [{ id: 'a', text: '13 \u0645\u0646\u0637\u0642\u0629' }, { id: 'b', text: '22 \u0645\u0646\u0637\u0642\u0629' }, { id: 'c', text: '26 \u0645\u0646\u0637\u0642\u0629' }, { id: 'd', text: '10 \u0645\u0646\u0627\u0637\u0642' }] },
      { lang: 'es', text: 'Cuantas regiones tiene la Francia metropolitana?', explanation: 'Desde 2016, 13 regiones metropolitanas.', choices: [{ id: 'a', text: '13 regiones' }, { id: 'b', text: '22 regiones' }, { id: 'c', text: '26 regiones' }, { id: 'd', text: '10 regiones' }] },
      { lang: 'pt', text: 'Quantas regioes tem a Franca metropolitana?', explanation: 'Desde 2016, 13 regioes metropolitanas.', choices: [{ id: 'a', text: '13 regioes' }, { id: 'b', text: '22 regioes' }, { id: 'c', text: '26 regioes' }, { id: 'd', text: '10 regioes' }] },
    ],
  },
  {
    themeId: 4,
    type: 'knowledge',
    difficulty: 1,
    isPremium: false,
    textFr: 'Quelle est la capitale de la France ?',
    explanationFr: 'Paris est la capitale de la France. C\'est aussi le siege du gouvernement et des principales institutions de l\'Etat.',
    choicesFr: [
      { id: 'a', text: 'Paris' },
      { id: 'b', text: 'Lyon' },
      { id: 'c', text: 'Marseille' },
      { id: 'd', text: 'Bordeaux' },
    ],
    correctChoice: 'a',
    translations: [
      { lang: 'ar', text: '\u0645\u0627 \u0647\u064a \u0639\u0627\u0635\u0645\u0629 \u0641\u0631\u0646\u0633\u0627\u061f', explanation: '\u0628\u0627\u0631\u064a\u0633 \u0647\u064a \u0639\u0627\u0635\u0645\u0629 \u0641\u0631\u0646\u0633\u0627.', choices: [{ id: 'a', text: '\u0628\u0627\u0631\u064a\u0633' }, { id: 'b', text: '\u0644\u064a\u0648\u0646' }, { id: 'c', text: '\u0645\u0627\u0631\u0633\u064a\u0644\u064a\u0627' }, { id: 'd', text: '\u0628\u0648\u0631\u062f\u0648' }] },
      { lang: 'es', text: 'Cual es la capital de Francia?', explanation: 'Paris es la capital de Francia.', choices: [{ id: 'a', text: 'Paris' }, { id: 'b', text: 'Lyon' }, { id: 'c', text: 'Marsella' }, { id: 'd', text: 'Burdeos' }] },
      { lang: 'pt', text: 'Qual e a capital da Franca?', explanation: 'Paris e a capital da Franca.', choices: [{ id: 'a', text: 'Paris' }, { id: 'b', text: 'Lyon' }, { id: 'c', text: 'Marselha' }, { id: 'd', text: 'Bordeaux' }] },
    ],
  },
  {
    themeId: 4,
    type: 'knowledge',
    difficulty: 2,
    isPremium: false,
    textFr: 'Quand l\'esclavage a-t-il ete definitivement aboli en France ?',
    explanationFr: 'L\'abolition definitive de l\'esclavage en France a ete proclamee le 27 avril 1848, sous l\'impulsion de Victor Schoelcher.',
    choicesFr: [
      { id: 'a', text: 'En 1848' },
      { id: 'b', text: 'En 1789' },
      { id: 'c', text: 'En 1905' },
      { id: 'd', text: 'En 1945' },
    ],
    correctChoice: 'a',
  },
  {
    themeId: 4,
    type: 'knowledge',
    difficulty: 3,
    isPremium: true,
    textFr: 'Qui a ecrit "Du contrat social" ?',
    explanationFr: 'Jean-Jacques Rousseau a ecrit "Du contrat social" en 1762. Ce livre a profondement influence la Revolution francaise.',
    choicesFr: [
      { id: 'a', text: 'Jean-Jacques Rousseau' },
      { id: 'b', text: 'Voltaire' },
      { id: 'c', text: 'Montesquieu' },
      { id: 'd', text: 'Denis Diderot' },
    ],
    correctChoice: 'a',
  },
  {
    themeId: 4,
    type: 'knowledge',
    difficulty: 2,
    isPremium: false,
    textFr: 'Qu\'est-ce que la Cinquieme Republique ?',
    explanationFr: 'La Ve Republique est le regime politique actuel de la France, instaure par la Constitution du 4 octobre 1958 sous le general de Gaulle.',
    choicesFr: [
      { id: 'a', text: 'Le regime politique actuel, depuis 1958' },
      { id: 'b', text: 'Le regime de Napoleon' },
      { id: 'c', text: 'Le regime de la Revolution' },
      { id: 'd', text: 'Le regime de Vichy' },
    ],
    correctChoice: 'a',
  },

  // ── Theme 5: Vivre dans la societe francaise (id=5) ──
  {
    themeId: 5,
    type: 'knowledge',
    difficulty: 1,
    isPremium: false,
    textFr: 'A qui faut-il s\'adresser pour declarer une naissance ?',
    explanationFr: 'La declaration de naissance doit etre faite a la mairie du lieu de naissance dans les 5 jours suivant l\'accouchement.',
    choicesFr: [
      { id: 'a', text: 'A la mairie' },
      { id: 'b', text: 'A la prefecture' },
      { id: 'c', text: 'A l\'hopital uniquement' },
      { id: 'd', text: 'A la police' },
    ],
    correctChoice: 'a',
    translations: [
      {
        lang: 'ar',
        text: '\u0625\u0644\u0649 \u0645\u0646 \u064a\u062c\u0628 \u0627\u0644\u062a\u0648\u062c\u0647 \u0644\u0644\u0625\u0639\u0644\u0627\u0646 \u0639\u0646 \u0648\u0644\u0627\u062f\u0629\u061f',
        explanation: '\u064a\u062c\u0628 \u0627\u0644\u0625\u0639\u0644\u0627\u0646 \u0639\u0646 \u0627\u0644\u0648\u0644\u0627\u062f\u0629 \u0641\u064a \u0627\u0644\u0628\u0644\u062f\u064a\u0629 \u062e\u0644\u0627\u0644 5 \u0623\u064a\u0627\u0645.',
        choices: [
          { id: 'a', text: '\u0625\u0644\u0649 \u0627\u0644\u0628\u0644\u062f\u064a\u0629' },
          { id: 'b', text: '\u0625\u0644\u0649 \u0627\u0644\u0645\u062d\u0627\u0641\u0638\u0629' },
          { id: 'c', text: '\u0625\u0644\u0649 \u0627\u0644\u0645\u0633\u062a\u0634\u0641\u0649 \u0641\u0642\u0637' },
          { id: 'd', text: '\u0625\u0644\u0649 \u0627\u0644\u0634\u0631\u0637\u0629' },
        ],
      },
      {
        lang: 'es',
        text: 'A quien hay que dirigirse para declarar un nacimiento?',
        explanation: 'La declaracion de nacimiento debe hacerse en el ayuntamiento dentro de los 5 dias.',
        choices: [
          { id: 'a', text: 'Al ayuntamiento' },
          { id: 'b', text: 'A la prefectura' },
          { id: 'c', text: 'Solo al hospital' },
          { id: 'd', text: 'A la policia' },
        ],
      },
      {
        lang: 'pt',
        text: 'A quem deve dirigir-se para declarar um nascimento?',
        explanation: 'A declaracao de nascimento deve ser feita na camara municipal dentro de 5 dias.',
        choices: [
          { id: 'a', text: 'A camara municipal' },
          { id: 'b', text: 'A prefeitura' },
          { id: 'c', text: 'Apenas ao hospital' },
          { id: 'd', text: 'A policia' },
        ],
      },
    ],
  },
  {
    themeId: 5,
    type: 'knowledge',
    difficulty: 1,
    isPremium: false,
    textFr: 'Quel numero appeler en cas d\'urgence en France ?',
    explanationFr: 'Le 15 (SAMU), le 17 (police) et le 18 (pompiers) sont les numeros d\'urgence. Le 112 est le numero d\'urgence europeen.',
    choicesFr: [
      { id: 'a', text: '15 (SAMU), 17 (police), 18 (pompiers), ou 112' },
      { id: 'b', text: '911' },
      { id: 'c', text: '999' },
      { id: 'd', text: '100' },
    ],
    correctChoice: 'a',
    translations: [
      {
        lang: 'ar',
        text: '\u0645\u0627 \u0647\u0648 \u0631\u0642\u0645 \u0627\u0644\u0637\u0648\u0627\u0631\u0626 \u0641\u064a \u0641\u0631\u0646\u0633\u0627\u061f',
        explanation: '15 (\u0627\u0644\u0625\u0633\u0639\u0627\u0641)\u060c 17 (\u0627\u0644\u0634\u0631\u0637\u0629)\u060c 18 (\u0627\u0644\u0625\u0637\u0641\u0627\u0621)\u060c \u0623\u0648 112 (\u0627\u0644\u0623\u0648\u0631\u0648\u0628\u064a).',
        choices: [
          { id: 'a', text: '15\u060c 17\u060c 18 \u0623\u0648 112' },
          { id: 'b', text: '911' },
          { id: 'c', text: '999' },
          { id: 'd', text: '100' },
        ],
      },
      {
        lang: 'es',
        text: 'Que numero llamar en caso de emergencia en Francia?',
        explanation: '15 (SAMU), 17 (policia), 18 (bomberos) o 112 (europeo).',
        choices: [
          { id: 'a', text: '15, 17, 18 o 112' },
          { id: 'b', text: '911' },
          { id: 'c', text: '999' },
          { id: 'd', text: '100' },
        ],
      },
      {
        lang: 'pt',
        text: 'Qual numero ligar em caso de emergencia na Franca?',
        explanation: '15 (SAMU), 17 (policia), 18 (bombeiros) ou 112 (europeu).',
        choices: [
          { id: 'a', text: '15, 17, 18 ou 112' },
          { id: 'b', text: '911' },
          { id: 'c', text: '999' },
          { id: 'd', text: '100' },
        ],
      },
    ],
  },
  {
    themeId: 5,
    type: 'knowledge',
    difficulty: 1,
    isPremium: false,
    textFr: 'Qu\'est-ce que la carte Vitale ?',
    explanationFr: 'La carte Vitale est la carte d\'assurance maladie. Elle permet le remboursement des soins medicaux par la Securite sociale.',
    choicesFr: [
      { id: 'a', text: 'La carte d\'assurance maladie de la Securite sociale' },
      { id: 'b', text: 'Une carte de credit' },
      { id: 'c', text: 'Un titre de sejour' },
      { id: 'd', text: 'Une carte de transport' },
    ],
    correctChoice: 'a',
    translations: [
      { lang: 'ar', text: '\u0645\u0627 \u0647\u064a \u0628\u0637\u0627\u0642\u0629 \u0641\u064a\u062a\u0627\u0644\u061f', explanation: '\u0628\u0637\u0627\u0642\u0629 \u0627\u0644\u062a\u0623\u0645\u064a\u0646 \u0627\u0644\u0635\u062d\u064a \u0644\u0644\u0636\u0645\u0627\u0646 \u0627\u0644\u0627\u062c\u062a\u0645\u0627\u0639\u064a.', choices: [{ id: 'a', text: '\u0628\u0637\u0627\u0642\u0629 \u0627\u0644\u062a\u0623\u0645\u064a\u0646 \u0627\u0644\u0635\u062d\u064a' }, { id: 'b', text: '\u0628\u0637\u0627\u0642\u0629 \u0627\u0626\u062a\u0645\u0627\u0646' }, { id: 'c', text: '\u062a\u0635\u0631\u064a\u062d \u0625\u0642\u0627\u0645\u0629' }, { id: 'd', text: '\u0628\u0637\u0627\u0642\u0629 \u0646\u0642\u0644' }] },
      { lang: 'es', text: 'Que es la tarjeta Vitale?', explanation: 'La tarjeta del seguro de salud de la Seguridad Social.', choices: [{ id: 'a', text: 'La tarjeta del seguro de salud' }, { id: 'b', text: 'Una tarjeta de credito' }, { id: 'c', text: 'Un permiso de residencia' }, { id: 'd', text: 'Una tarjeta de transporte' }] },
      { lang: 'pt', text: 'O que e o cartao Vitale?', explanation: 'O cartao de seguro de saude da Seguranca Social.', choices: [{ id: 'a', text: 'O cartao de seguro de saude' }, { id: 'b', text: 'Um cartao de credito' }, { id: 'c', text: 'Uma autorizacao de residencia' }, { id: 'd', text: 'Um cartao de transporte' }] },
    ],
  },
  {
    themeId: 5,
    type: 'knowledge',
    difficulty: 2,
    isPremium: false,
    textFr: 'Ou faut-il s\'inscrire pour voter ?',
    explanationFr: 'Pour voter, il faut s\'inscrire sur les listes electorales de sa commune, a la mairie ou en ligne.',
    choicesFr: [
      { id: 'a', text: 'Sur les listes electorales de sa mairie' },
      { id: 'b', text: 'Au commissariat de police' },
      { id: 'c', text: 'A la prefecture' },
      { id: 'd', text: 'Pas besoin de s\'inscrire' },
    ],
    correctChoice: 'a',
  },
  {
    themeId: 5,
    type: 'knowledge',
    difficulty: 2,
    isPremium: false,
    textFr: 'Qu\'est-ce que Pole emploi (France Travail) ?',
    explanationFr: 'France Travail (anciennement Pole emploi) est le service public de l\'emploi. Il aide les demandeurs d\'emploi et verse les allocations chomage.',
    choicesFr: [
      { id: 'a', text: 'Le service public d\'aide a l\'emploi et d\'indemnisation chomage' },
      { id: 'b', text: 'Un hopital public' },
      { id: 'c', text: 'Une banque nationale' },
      { id: 'd', text: 'Un tribunal' },
    ],
    correctChoice: 'a',
    translations: [
      { lang: 'ar', text: '\u0645\u0627 \u0647\u0648 \u0641\u0631\u0627\u0646\u0633 \u062a\u0631\u0627\u0641\u0627\u064a (Pole emploi)\u061f', explanation: '\u0627\u0644\u062e\u062f\u0645\u0629 \u0627\u0644\u0639\u0627\u0645\u0629 \u0644\u0644\u062a\u0648\u0638\u064a\u0641 \u0648\u062a\u0639\u0648\u064a\u0636 \u0627\u0644\u0628\u0637\u0627\u0644\u0629.', choices: [{ id: 'a', text: '\u0627\u0644\u062e\u062f\u0645\u0629 \u0627\u0644\u0639\u0627\u0645\u0629 \u0644\u0644\u062a\u0648\u0638\u064a\u0641' }, { id: 'b', text: '\u0645\u0633\u062a\u0634\u0641\u0649 \u0639\u0627\u0645' }, { id: 'c', text: '\u0628\u0646\u0643 \u0648\u0637\u0646\u064a' }, { id: 'd', text: '\u0645\u062d\u0643\u0645\u0629' }] },
      { lang: 'es', text: 'Que es France Travail (Pole emploi)?', explanation: 'El servicio publico de empleo y compensacion por desempleo.', choices: [{ id: 'a', text: 'El servicio publico de empleo' }, { id: 'b', text: 'Un hospital publico' }, { id: 'c', text: 'Un banco nacional' }, { id: 'd', text: 'Un tribunal' }] },
      { lang: 'pt', text: 'O que e o France Travail (Pole emploi)?', explanation: 'O servico publico de emprego e indemnizacao por desemprego.', choices: [{ id: 'a', text: 'O servico publico de emprego' }, { id: 'b', text: 'Um hospital publico' }, { id: 'c', text: 'Um banco nacional' }, { id: 'd', text: 'Um tribunal' }] },
    ],
  },
  {
    themeId: 5,
    type: 'knowledge',
    difficulty: 2,
    isPremium: false,
    textFr: 'Qu\'est-ce que la CAF ?',
    explanationFr: 'La CAF (Caisse d\'Allocations Familiales) verse des aides sociales aux familles : allocations familiales, aide au logement, RSA, etc.',
    choicesFr: [
      { id: 'a', text: 'La Caisse d\'Allocations Familiales qui verse des aides sociales' },
      { id: 'b', text: 'Un club de sport' },
      { id: 'c', text: 'Un service de police' },
      { id: 'd', text: 'Une ecole privee' },
    ],
    correctChoice: 'a',
    translations: [
      { lang: 'ar', text: '\u0645\u0627 \u0647\u0648 \u0635\u0646\u062f\u0648\u0642 \u0627\u0644\u0645\u062e\u0635\u0635\u0627\u062a \u0627\u0644\u0639\u0627\u0626\u0644\u064a\u0629 (CAF)\u061f', explanation: '\u0635\u0646\u062f\u0648\u0642 \u064a\u0635\u0631\u0641 \u0645\u0633\u0627\u0639\u062f\u0627\u062a \u0627\u062c\u062a\u0645\u0627\u0639\u064a\u0629 \u0644\u0644\u0639\u0627\u0626\u0644\u0627\u062a.', choices: [{ id: 'a', text: '\u0635\u0646\u062f\u0648\u0642 \u0627\u0644\u0645\u062e\u0635\u0635\u0627\u062a \u0627\u0644\u0639\u0627\u0626\u0644\u064a\u0629' }, { id: 'b', text: '\u0646\u0627\u062f\u064a \u0631\u064a\u0627\u0636\u064a' }, { id: 'c', text: '\u062e\u062f\u0645\u0629 \u0634\u0631\u0637\u0629' }, { id: 'd', text: '\u0645\u062f\u0631\u0633\u0629 \u062e\u0627\u0635\u0629' }] },
      { lang: 'es', text: 'Que es la CAF?', explanation: 'La Caja de Asignaciones Familiares que paga ayudas sociales.', choices: [{ id: 'a', text: 'Caja de Asignaciones Familiares' }, { id: 'b', text: 'Un club deportivo' }, { id: 'c', text: 'Un servicio de policia' }, { id: 'd', text: 'Una escuela privada' }] },
      { lang: 'pt', text: 'O que e a CAF?', explanation: 'A Caixa de Abonos Familiares que paga ajudas sociais.', choices: [{ id: 'a', text: 'Caixa de Abonos Familiares' }, { id: 'b', text: 'Um clube desportivo' }, { id: 'c', text: 'Um servico de policia' }, { id: 'd', text: 'Uma escola privada' }] },
    ],
  },
  {
    themeId: 5,
    type: 'situational',
    difficulty: 1,
    isPremium: false,
    textFr: 'Vous venez d\'arriver en France. Quelle demarche administrative devez-vous faire en priorite ?',
    explanationFr: 'En arrivant en France, les etrangers doivent d\'abord regulariser leur situation administrative (titre de sejour) aupres de la prefecture.',
    choicesFr: [
      { id: 'a', text: 'Se rendre a la prefecture pour le titre de sejour' },
      { id: 'b', text: 'S\'inscrire a l\'armee' },
      { id: 'c', text: 'Ouvrir un restaurant' },
      { id: 'd', text: 'Acheter une voiture' },
    ],
    correctChoice: 'a',
  },
  {
    themeId: 5,
    type: 'knowledge',
    difficulty: 2,
    isPremium: false,
    textFr: 'Quel est le systeme de protection sociale en France ?',
    explanationFr: 'La Securite sociale couvre les risques maladie, maternite, invalidite, vieillesse, accidents du travail et charges familiales.',
    choicesFr: [
      { id: 'a', text: 'La Securite sociale, qui couvre maladie, retraite, famille et accidents du travail' },
      { id: 'b', text: 'Il n\'y a pas de protection sociale' },
      { id: 'c', text: 'Seulement une assurance privee' },
      { id: 'd', text: 'Seulement pour les fonctionnaires' },
    ],
    correctChoice: 'a',
  },
  {
    themeId: 5,
    type: 'knowledge',
    difficulty: 2,
    isPremium: true,
    textFr: 'Qu\'est-ce que le contrat d\'integration republicaine (CIR) ?',
    explanationFr: 'Le CIR est signe par les etrangers primo-arrivants. Il comprend une formation civique et linguistique pour faciliter l\'integration.',
    choicesFr: [
      { id: 'a', text: 'Un contrat de formation civique et linguistique pour les nouveaux arrivants' },
      { id: 'b', text: 'Un contrat de travail' },
      { id: 'c', text: 'Un contrat bancaire' },
      { id: 'd', text: 'Un contrat de location' },
    ],
    correctChoice: 'a',
  },
  {
    themeId: 5,
    type: 'situational',
    difficulty: 2,
    isPremium: false,
    textFr: 'Votre enfant est malade et ne peut pas aller a l\'ecole. Que devez-vous faire ?',
    explanationFr: 'Il faut prevenir l\'ecole et consulter un medecin. Si l\'absence dure plus de 48 heures, un certificat medical peut etre demande.',
    choicesFr: [
      { id: 'a', text: 'Prevenir l\'ecole et consulter un medecin' },
      { id: 'b', text: 'Ne rien faire' },
      { id: 'c', text: 'L\'envoyer quand meme a l\'ecole' },
      { id: 'd', text: 'Appeler la police' },
    ],
    correctChoice: 'a',
  },
];

// ────────────────────────────────────────────────────────────────
// Fiches - 1 per theme
// ────────────────────────────────────────────────────────────────

const fichesData = [
  {
    themeId: 1,
    titleFr: 'Les principes et valeurs de la Republique francaise',
    contentFr: `# Les principes et valeurs de la Republique francaise

## La devise : Liberte, Egalite, Fraternite

La devise de la Republique francaise est inscrite dans la Constitution. Elle resume les valeurs fondamentales de la nation.

- **Liberte** : chaque citoyen est libre de ses opinions, de sa religion, de ses deplacements.
- **Egalite** : tous les citoyens sont egaux devant la loi, sans distinction d'origine, de race ou de religion.
- **Fraternite** : les citoyens doivent faire preuve de solidarite les uns envers les autres.

## La laicite

La loi du 9 decembre 1905 a instaure la separation des Eglises et de l'Etat. La laicite garantit la liberte de conscience : chacun est libre de croire ou de ne pas croire. L'Etat ne privilegie aucune religion.

## Les symboles de la Republique

- Le **drapeau tricolore** (bleu, blanc, rouge)
- L'**hymne national** : la Marseillaise
- **Marianne** : figure feminine qui represente la Republique
- La **devise** : Liberte, Egalite, Fraternite

## La democratie

La France est une republique democratique. Le pouvoir appartient au peuple, qui l'exerce par le vote. Le suffrage est universel : tout citoyen majeur peut voter.`,
    displayOrder: 1,
    isPremium: false,
  },
  {
    themeId: 2,
    titleFr: 'Le systeme institutionnel et politique francais',
    contentFr: `# Le systeme institutionnel et politique francais

## La Constitution de 1958

La Ve Republique a ete fondee par la Constitution du 4 octobre 1958. Elle organise les pouvoirs de l'Etat.

## Le President de la Republique

- Chef de l'Etat, elu au suffrage universel direct pour 5 ans (quinquennat)
- Nomme le Premier ministre
- Peut dissoudre l'Assemblee nationale
- Chef des armees

## Le Gouvernement

- Dirige par le Premier ministre
- Conduit la politique de la nation
- Responsable devant l'Assemblee nationale

## Le Parlement

Le Parlement vote les lois. Il est compose de deux assemblees :
- L'**Assemblee nationale** : 577 deputes elus au suffrage universel direct pour 5 ans
- Le **Senat** : 348 senateurs elus au suffrage universel indirect pour 6 ans

## Les collectivites territoriales

- **Communes** : plus de 35 000, dirigees par un maire et un conseil municipal
- **Departements** : 101 (96 metropolitains + 5 d'outre-mer)
- **Regions** : 18 (13 metropolitaines + 5 d'outre-mer)`,
    displayOrder: 1,
    isPremium: false,
  },
  {
    themeId: 3,
    titleFr: 'Les droits et devoirs du citoyen',
    contentFr: `# Les droits et devoirs du citoyen

## Les droits fondamentaux

La Declaration des Droits de l'Homme et du Citoyen (1789) et la Constitution garantissent :

- **Liberte d'expression** : chacun peut exprimer ses opinions (dans le respect de la loi)
- **Liberte de conscience et de religion** : chacun est libre de ses croyances
- **Droit de vote** : tout citoyen majeur (18 ans) peut voter
- **Egalite devant la loi** : sans distinction d'origine, de sexe ou de religion
- **Droit a l'education** : l'instruction est obligatoire de 3 a 16 ans
- **Droit d'asile** : protection des personnes persecutees
- **Presomption d'innocence** : toute personne est innocente jusqu'a preuve du contraire

## Les devoirs

- **Respecter les lois** de la Republique
- **Payer les impots** : ils financent les services publics
- **Participer a la defense nationale** : Journee defense et citoyennete (JDC)
- **Voter** : c'est un devoir moral (pas juridiquement obligatoire)
- **Respecter les droits d'autrui**
- **Scolariser ses enfants**

## L'egalite femmes-hommes

L'egalite entre les femmes et les hommes est un principe constitutionnel. Les femmes ont obtenu le droit de vote en 1944.`,
    displayOrder: 1,
    isPremium: false,
  },
  {
    themeId: 4,
    titleFr: 'Histoire, geographie et culture de la France',
    contentFr: `# Histoire, geographie et culture de la France

## Grandes dates de l'histoire

- **1789** : Revolution francaise, prise de la Bastille (14 juillet), Declaration des Droits de l'Homme et du Citoyen
- **1848** : Abolition definitive de l'esclavage (Victor Schoelcher)
- **1905** : Loi de separation des Eglises et de l'Etat
- **1944** : Droit de vote des femmes
- **1945** : Fin de la Seconde Guerre mondiale (8 mai)
- **1958** : Fondation de la Ve Republique (Constitution du 4 octobre)

## Les jours feries et commemorations

- **14 juillet** : Fete nationale (prise de la Bastille)
- **11 novembre** : Armistice de 1918 (fin de la Premiere Guerre mondiale)
- **8 mai** : Victoire de 1945 (fin de la Seconde Guerre mondiale en Europe)

## Geographie

- **Capitale** : Paris
- **Population** : environ 68 millions d'habitants
- **13 regions metropolitaines** et 5 regions d'outre-mer
- La France est le plus grand pays de l'Union europeenne par sa superficie

## Les Lumieres

Mouvement intellectuel du XVIIIe siecle portant les idees de raison, liberte et progres. Figures principales : Voltaire, Rousseau, Montesquieu, Diderot.`,
    displayOrder: 1,
    isPremium: false,
  },
  {
    themeId: 5,
    titleFr: 'Vivre dans la societe francaise',
    contentFr: `# Vivre dans la societe francaise

## Demarches administratives

- **Naissance** : declaration a la mairie dans les 5 jours
- **Titre de sejour** : demande a la prefecture
- **Inscription electorale** : a la mairie ou en ligne
- **Carte Vitale** : carte d'assurance maladie delivree par la Securite sociale

## Les numeros d'urgence

- **15** : SAMU (urgences medicales)
- **17** : Police / Gendarmerie
- **18** : Pompiers
- **112** : Numero d'urgence europeen (fonctionne dans toute l'UE)

## La protection sociale

La Securite sociale est le systeme de protection sociale francais. Elle couvre :
- Maladie et maternite
- Retraite
- Allocations familiales (CAF)
- Accidents du travail

## L'emploi

- **France Travail** (ex-Pole emploi) : aide a la recherche d'emploi et indemnisation chomage
- Le SMIC (salaire minimum) garantit un revenu minimum a tout travailleur
- Le contrat de travail (CDI, CDD) definit les droits et obligations

## Le contrat d'integration republicaine (CIR)

Les etrangers primo-arrivants signent le CIR qui comprend :
- Une formation civique sur les valeurs de la Republique
- Une formation linguistique en francais (si necessaire)
- Un accompagnement vers l'emploi et le logement`,
    displayOrder: 1,
    isPremium: false,
  },
];

// ────────────────────────────────────────────────────────────────
// Main seed function
// ────────────────────────────────────────────────────────────────

async function seed() {
  console.log('Seeding database...');

  // 1. Insert themes (upsert by id)
  console.log('Inserting themes...');
  for (const t of themesData) {
    await db
      .insert(schema.themes)
      .values(t)
      .onConflictDoUpdate({
        target: schema.themes.code,
        set: {
          nameFr: t.nameFr,
          icon: t.icon,
          color: t.color,
          displayOrder: t.displayOrder,
        },
      });
  }
  console.log(`  ${themesData.length} themes inserted.`);

  // 2. Insert questions
  console.log('Inserting questions...');
  let questionCount = 0;
  let translationCount = 0;

  for (const q of questionsData) {
    const [inserted] = await db
      .insert(schema.questions)
      .values({
        themeId: q.themeId,
        type: q.type,
        difficulty: q.difficulty,
        isPremium: q.isPremium,
        textFr: q.textFr,
        explanationFr: q.explanationFr,
        choicesFr: q.choicesFr,
        correctChoice: q.correctChoice,
      })
      .returning({ id: schema.questions.id });

    questionCount++;

    // Insert translations if present
    if (q.translations) {
      for (const tr of q.translations) {
        await db.insert(schema.questionTranslations).values({
          questionId: inserted.id,
          lang: tr.lang,
          text: tr.text,
          explanation: tr.explanation,
          choices: tr.choices,
        });
        translationCount++;
      }
    }
  }
  console.log(`  ${questionCount} questions inserted.`);
  console.log(`  ${translationCount} question translations inserted.`);

  // 3. Insert fiches
  console.log('Inserting fiches...');
  for (const f of fichesData) {
    await db.insert(schema.fiches).values({
      themeId: f.themeId,
      titleFr: f.titleFr,
      contentFr: f.contentFr,
      displayOrder: f.displayOrder,
      isPremium: f.isPremium,
    });
  }
  console.log(`  ${fichesData.length} fiches inserted.`);

  console.log('Seeding complete!');
}

seed()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
