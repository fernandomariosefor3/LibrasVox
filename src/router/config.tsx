import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import DictionaryPage from "../pages/dictionary/page";
import AlphabetPage from "../pages/alphabet/page";
import AssistantPage from "../pages/assistant/page";
import RecognitionPage from "../pages/recognition/page";
import VisionCollectionPage from "../pages/vision-collection/page";
import RealMediaPage from "../pages/vision-collection/real-media-page";
import ProgressPage from "../pages/progress/page";
import CoursesPage from "../pages/courses/page";
import ExercisesPage from "../pages/exercises/page";
import ReferencesPage from "../pages/references/page";
import GrammarPage from "../pages/grammar/page";
import FAQPage from "../pages/faq/page";
import VideoLessonsPage from "../pages/videolessons/page";
import PhrasesPage from "../pages/phrases/page";
import FlashcardsPage from "../pages/flashcards/page";

const routes: RouteObject[] = [
  { path: "/", element: <Home /> },
  { path: "/cursos", element: <CoursesPage /> },
  { path: "/gramatica", element: <GrammarPage /> },
  { path: "/exercicios", element: <ExercisesPage /> },
  { path: "/referencias", element: <ReferencesPage /> },
  { path: "/dictionary", element: <DictionaryPage /> },
  { path: "/alphabet", element: <AlphabetPage /> },
  { path: "/assistant", element: <AssistantPage /> },
  { path: "/recognition", element: <RecognitionPage /> },
  { path: "/vision/coleta", element: <VisionCollectionPage /> },
  { path: "/vision/midia-real", element: <RealMediaPage /> },
  { path: "/progress", element: <ProgressPage /> },
  { path: "/faq", element: <FAQPage /> },
  { path: "/videoaulas", element: <VideoLessonsPage /> },
  { path: "/frases", element: <PhrasesPage /> },
  { path: "/flashcards", element: <FlashcardsPage /> },
  { path: "*", element: <NotFound /> },
];

export default routes;
