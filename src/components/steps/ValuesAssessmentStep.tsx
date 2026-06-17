import { useMemo } from 'react';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import {
  QUESTION_POOL,
  QUESTION_COUNT,
  RANK_POINTS,
  type AssessmentOption,
  type AssessmentQuestion,
  type DriverKey,
} from '@/data/valuesAssessment';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export interface ValuesAssessmentStepProps {
  /** Ordered list of questions with current option ranking. */
  questions: AssessmentQuestion[];
  onChange: (questions: AssessmentQuestion[]) => void;
}

/** Build a fresh randomized assessment (15 questions, options shuffled). */
export function buildInitialAssessment(): AssessmentQuestion[] {
  return shuffle(QUESTION_POOL)
    .slice(0, QUESTION_COUNT)
    .map((q) => ({ ...q, options: shuffle(q.options) }));
}

const ValuesAssessmentStep = ({ questions, onChange }: ValuesAssessmentStepProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const qIdx = active.data.current?.questionIndex as number | undefined;
    if (typeof qIdx !== 'number') return;
    const next = [...questions];
    const fromIdx = next[qIdx].options.findIndex((o) => `${qIdx}-${o.value}-${o.type}` === active.id);
    const toIdx = next[qIdx].options.findIndex((o) => `${qIdx}-${o.value}-${o.type}` === over.id);
    if (fromIdx < 0 || toIdx < 0) return;
    next[qIdx] = { ...next[qIdx], options: arrayMove(next[qIdx].options, fromIdx, toIdx) };
    onChange(next);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
        <p className="text-sm font-semibold text-foreground">Values Assessment</p>
        <p className="text-sm text-muted-foreground mt-1">
          For each question, please rank the options from <span className="font-semibold text-foreground">most preferred (top)</span> to
          <span className="font-semibold text-foreground"> least preferred (bottom)</span> by dragging and dropping them. Your answers help us
          understand what motivates you at work.
        </p>
      </div>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="space-y-6">
          {questions.map((q, index) => (
            <QuestionCard key={`${index}-${q.question}`} question={q} questionIndex={index} questionNumber={index + 1} />
          ))}
        </div>
      </DndContext>
    </div>
  );
};

interface QuestionCardProps {
  question: AssessmentQuestion;
  questionIndex: number;
  questionNumber: number;
}

const QuestionCard = ({ question, questionIndex, questionNumber }: QuestionCardProps) => {
  const ids = useMemo(
    () => question.options.map((o) => `${questionIndex}-${o.value}-${o.type}`),
    [question.options, questionIndex],
  );

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-baseline gap-3 mb-1">
        <span className="text-xs font-semibold text-primary bg-primary/10 rounded-full px-2 py-0.5 shrink-0">
          {questionNumber}
        </span>
        <h3 className="font-heading text-base sm:text-lg font-semibold text-foreground">{question.question}</h3>
      </div>
      <p className="text-xs text-muted-foreground italic mb-4 ml-9">{question.reference}</p>

      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <ol className="space-y-2">
          {question.options.map((opt, i) => (
            <SortableOption
              key={ids[i]}
              id={ids[i]}
              option={opt}
              rank={i + 1}
              questionIndex={questionIndex}
            />
          ))}
        </ol>
      </SortableContext>
    </div>
  );
};

interface SortableOptionProps {
  id: string;
  option: AssessmentOption;
  rank: number;
  questionIndex: number;
}

const SortableOption = ({ id, option, rank, questionIndex }: SortableOptionProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    data: { questionIndex },
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 'auto',
    boxShadow: isDragging ? '0 12px 24px -8px hsl(var(--primary) / 0.25)' : undefined,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 select-none transition-colors ${
        isDragging
          ? 'border-primary bg-primary/5'
          : 'border-border bg-background hover:border-primary/40 hover:bg-muted/40'
      }`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none"
        aria-label="Drag to reorder"
      >
        <GripVertical className="w-4 h-4" />
      </button>
      <span className="text-xs font-semibold text-muted-foreground w-6 shrink-0 tabular-nums">{rank}.</span>
      <span className="text-sm text-foreground">{option.type}</span>
    </li>
  );
};

export default ValuesAssessmentStep;

/** Compute the value driver scores from the ranked answers. */
export function computeScores(questions: AssessmentQuestion[]): Record<DriverKey, number> {
  const scores: Record<DriverKey, number> = {
    aesthetic: 0,
    altruistic: 0,
    individualistic: 0,
    theoretical: 0,
    economic: 0,
    political: 0,
    regulatory: 0,
  };
  questions.forEach((q) => {
    q.options.forEach((opt, index) => {
      const pts = RANK_POINTS[index] ?? 0;
      scores[opt.value] += pts;
    });
  });
  return scores;
}
