import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, View } from 'react-native';
import RenderHTML from 'react-native-render-html';
import {
  checklistProgress,
  getCategory,
  getRichText,
  goalProgress,
  stripHtml,
  type Note,
} from '../lib/notes';

interface Props {
  note: Note;
  contentWidth?: number;
}

function ChecklistPreview({ note }: { note: Note }) {
  const { items, done, total } = checklistProgress(note.rich);
  if (total === 0) {
    return (
      <Text style={{ color: '#666', fontSize: 13 }}>Empty checklist</Text>
    );
  }
  return (
    <View>
      {items.map((t) => (
        <View
          key={String(t.id)}
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}
        >
          <Ionicons
            name={t.checked ? 'checkbox' : 'square-outline'}
            size={16}
            color={t.checked ? '#6A3EA1' : '#999'}
          />
          <Text
            style={{
              flex: 1,
              flexWrap: 'wrap',
              fontSize: 13,
              marginLeft: 6,
              textDecorationLine: t.checked ? 'line-through' : 'none',
              color: t.checked ? '#999' : '#222',
            }}
            numberOfLines={1}
          >
            {t.text}
          </Text>
        </View>
      ))}
      {total > items.length ? (
        <Text style={{ color: '#999', fontSize: 12 }}>
          +{total - items.length} more
        </Text>
      ) : null}
      <Text style={{ color: '#6A3EA1', fontSize: 12, marginTop: 2 }}>
        {done}/{total} done
      </Text>
    </View>
  );
}

function GoalsPreview({ note }: { note: Note }) {
  const { done, total } = goalProgress(note.rich);
  if (!Array.isArray(note.rich) || note.rich.length === 0) {
    return <Text style={{ color: '#666', fontSize: 13 }}>No goals yet</Text>;
  }
  const goals = (note.rich as any[]).slice(0, 3);
  return (
    <View>
      <Text style={{ color: '#6A3EA1', fontSize: 12, marginBottom: 4 }}>
        {done}/{total} done
      </Text>
      {goals.map((g: any) => (
        <View
          key={String(g.id)}
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}
        >
          <Ionicons
            name={g.checked ? 'checkmark-circle' : 'ellipse-outline'}
            size={16}
            color={g.checked ? '#059669' : '#999'}
          />
          <Text
            style={{
              flex: 1,
              fontSize: 13,
              marginLeft: 6,
              textDecorationLine: g.checked ? 'line-through' : 'none',
              color: g.checked ? '#999' : '#222',
            }}
            numberOfLines={1}
          >
            {g.text}
          </Text>
        </View>
      ))}
      {note.rich.length > 3 ? (
        <Text style={{ color: '#999', fontSize: 12 }}>
          +{note.rich.length - 3} more
        </Text>
      ) : null}
    </View>
  );
}

function RoutinePreview({ note }: { note: Note }) {
  if (!Array.isArray(note.rich) || note.rich.length === 0) {
    return <Text style={{ color: '#666', fontSize: 13 }}>No routine items</Text>;
  }
  const items = (note.rich as any[]).slice(0, 3);
  return (
    <View style={{ gap: 6 }}>
      {items.map((t: any) => (
        <View
          key={String(t.id)}
          style={{
            backgroundColor: t.colourK ?? '#F1F5F9',
            borderRadius: 8,
            paddingHorizontal: 8,
            paddingVertical: 6,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: 'bold',
              color: t.colourT ?? '#334155',
            }}
            numberOfLines={1}
          >
            {t.title || t.text}
          </Text>
          {!!t.title && (
            <Text
              style={{ fontSize: 12, color: t.colourT ?? '#334155' }}
              numberOfLines={1}
            >
              {t.text}
            </Text>
          )}
        </View>
      ))}
      {note.rich.length > 3 ? (
        <Text style={{ color: '#999', fontSize: 12 }}>
          +{note.rich.length - 3} more
        </Text>
      ) : null}
    </View>
  );
}

function HtmlPreview({ note, contentWidth }: { note: Note; contentWidth: number }) {
  const text = stripHtml(getRichText(note));
  if (!text) {
    return <Text style={{ color: '#666', fontSize: 13 }}>No content</Text>;
  }
  if (typeof note.rich === 'string' && note.rich.includes('<')) {
    return <RenderHTML contentWidth={contentWidth} source={{ html: note.rich }} />;
  }
  return (
    <Text style={{ color: '#333', fontSize: 13 }} numberOfLines={6}>
      {text}
    </Text>
  );
}

export default function NoteCardPreview({ note, contentWidth = 160 }: Props) {
  const category = getCategory(note);
  return (
    <View>
      <Text
        style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 5 }}
        numberOfLines={1}
      >
        {note.title || 'Untitled Note'}
      </Text>
      {category === 'buying' ? (
        <ChecklistPreview note={note} />
      ) : category === 'goals' ? (
        <GoalsPreview note={note} />
      ) : category === 'routine' ? (
        <RoutinePreview note={note} />
      ) : category === 'guidance' ? (
        <View>
          {note.image ? (
            <Image
              source={{ uri: note.image }}
              style={{ height: 80, width: '100%', borderRadius: 8, marginBottom: 6 }}
            />
          ) : null}
          <HtmlPreview note={note} contentWidth={contentWidth} />
        </View>
      ) : (
        <HtmlPreview note={note} contentWidth={contentWidth} />
      )}
    </View>
  );
}
