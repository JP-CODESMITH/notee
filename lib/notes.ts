import AsyncStorage from '@react-native-async-storage/async-storage';

export type NoteCategory = 'idea' | 'buying' | 'routine' | 'goals' | 'guidance';

export interface ChecklistItem {
  id: number | string;
  text: string;
  checked: boolean;
  title?: string;
  colourT?: string;
  colourK?: string;
  complete?: boolean;
}

export interface SubTodo {
  ids: string;
  subtext: string;
  checked: boolean;
}

export interface GoalTodo {
  id: number;
  text: string;
  checked: boolean;
  subTodo: SubTodo[];
}

export interface Note {
  id: string;
  title?: string;
  rich: string | ChecklistItem[] | GoalTodo[];
  backgroundColor: string;
  pin?: boolean;
  finished?: boolean;
  type?: NoteCategory;
  category?: NoteCategory;
  image?: string | null;
  createdAt?: number;
}

export type NotesDB = Record<NoteCategory, Note[]>;

export const EMPTY_DB: NotesDB = {
  idea: [],
  buying: [],
  routine: [],
  goals: [],
  guidance: [],
};

export const CATEGORIES: NoteCategory[] = [
  'idea',
  'buying',
  'routine',
  'goals',
  'guidance',
];

export function getCategory(n: Partial<Note>): NoteCategory {
  const c = (n.type ?? n.category ?? 'idea') as string;
  return (CATEGORIES.includes(c as NoteCategory) ? c : 'idea') as NoteCategory;
}

export function getBackgroundColor(n: Partial<Note>): string {
  const v: any = n as any;
  return (
    n.backgroundColor ??
    v.backgroundcolor ??
    v.backgroudcolor ??
    '#FFFFFF'
  );
}

export function getRichText(n: Partial<Note>): string {
  if (typeof n.rich === 'string') return n.rich;
  if (Array.isArray(n.rich)) {
    return n.rich
      .map((t: any) => t?.text ?? t?.subtext ?? '')
      .filter(Boolean)
      .join(' ');
  }
  return '';
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export function searchableText(n: Note): string {
  return `${n.title ?? ''} ${stripHtml(getRichText(n))}`.toLowerCase();
}

export async function loadDB(): Promise<NotesDB> {
  try {
    const raw = await AsyncStorage.getItem('notesDB');
    if (!raw) {
      await AsyncStorage.setItem('notesDB', JSON.stringify(EMPTY_DB));
      return { ...EMPTY_DB };
    }
    const db = JSON.parse(raw);
    const out: NotesDB = { ...EMPTY_DB };
    for (const c of CATEGORIES) {
      // Migrate legacy `buy` key into `buying`
      const legacy = c === 'buying' ? (db.buy ?? []) : [];
      const rows = [...(db[c] ?? []), ...(legacy ?? [])];
      out[c] = rows.map((n: any) => ({
        ...n,
        type: getCategory(n),
        category: undefined,
        backgroundColor: getBackgroundColor(n),
      }));
    }
    return out;
  } catch {
    return { ...EMPTY_DB };
  }
}

export async function saveDB(db: NotesDB): Promise<void> {
  await AsyncStorage.setItem('notesDB', JSON.stringify(db));
}

export function allNotes(db: NotesDB): Note[] {
  return [...db.idea, ...db.buying, ...db.routine, ...db.goals, ...db.guidance];
}

export async function persistNotes(notes: Note[]): Promise<void> {
  const db: NotesDB = { ...EMPTY_DB };
  for (const n of notes) {
    const clean: Note = {
      ...n,
      type: getCategory(n),
      category: undefined,
      backgroundColor: getBackgroundColor(n),
    };
    db[clean.type as NoteCategory].push(clean);
  }
  await saveDB(db);
}

export function footerLabel(n: Note): string {
  const c = getCategory(n);
  switch (c) {
    case 'buying':
      return 'Checklist';
    case 'routine':
      return 'Routine';
    case 'goals':
      return 'Goals';
    case 'guidance':
      return 'Guidance';
    default:
      return 'Interesting Ideas';
  }
}

const DARK_BY_BG: Record<string, string> = {
  '#C8C5CB': '#4B5563',
  '#EFE9F7': '#6A3EA1',
  '#F7DEE3': '#BE185D',
  '#DAF6E4': '#059669',
  '#FDEBAB': '#CA8A04',
  '#F7F6D4': '#A16207',
  '#EFEEF0': '#4B5563',
};

export function footerBackground(color: string): string {
  if (!color) return '#6B7280';
  if (color.toLowerCase() === 'white' || color === '#FFFFFF') return '#6B7280';
  return DARK_BY_BG[color] ?? '#6B7280';
}

export const NOTE_COLORS = [
  '#C8C5CB',
  '#F7DEE3',
  '#EFE9F7',
  '#DAF6E4',
  '#FDEBAB',
  '#F7F6D4',
  '#EFEEF0',
];

export const ROUTINE_COLORS = [
  { colour: '#F7F6D4', text: '#565510' },
  { colour: '#EFE9F7', text: '#6A3EA1' },
  { colour: '#DAF6E4', text: '#1F7F40' },
  { colour: '#FDEBAB', text: '#725A03' },
];
