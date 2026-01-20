import { useState } from 'react';

interface BucketItem {
  id: string;
  text: string;
  completed: boolean;
}

interface BucketListProps {
  year: number;
  items: BucketItem[];
  onAdd: (text: string) => void;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

export const BucketList = ({ year, items, onAdd, onToggle, onRemove }: BucketListProps) => {
  const [newItem, setNewItem] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.trim()) {
      onAdd(newItem.trim());
      setNewItem('');
    }
  };

  return (
    <section>
      <h2 className="section-title">Bucket List — {year}</h2>
      
      <div className="max-w-xl">
        {/* Add new item */}
        <form onSubmit={handleSubmit} className="flex gap-4 mb-6">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Add a goal..."
            className="flex-1 bg-background border-b-2 border-foreground py-2 font-mono text-sm placeholder:text-muted-foreground focus:outline-none"
          />
          <button
            type="submit"
            className="font-mono text-sm font-semibold uppercase tracking-wider px-4 py-2 border-2 border-foreground bg-background hover:bg-foreground hover:text-background"
          >
            Add
          </button>
        </form>

        {/* List items */}
        <div className="space-y-0">
          {items.length === 0 ? (
            <p className="font-mono text-sm text-muted-foreground py-4">
              No goals yet. Add your first goal above.
            </p>
          ) : (
            items.map(item => (
              <div
                key={item.id}
                className={`bucket-item group ${item.completed ? 'completed' : ''}`}
              >
                <button
                  onClick={() => onToggle(item.id)}
                  className={`habit-checkbox-large flex-shrink-0 ${item.completed ? 'checked' : ''}`}
                  aria-label={item.completed ? 'Mark as incomplete' : 'Mark as complete'}
                />
                <span className={`bucket-text font-mono text-sm flex-1 ${item.completed ? 'text-background' : ''}`}>
                  {item.text}
                </span>
                <button
                  onClick={() => onRemove(item.id)}
                  className={`font-mono text-xs uppercase tracking-wider opacity-0 group-hover:opacity-100 ${item.completed ? 'text-background' : 'text-muted-foreground hover:text-foreground'}`}
                  aria-label="Remove item"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

        {/* Stats */}
        {items.length > 0 && (
          <div className="mt-8 pt-4 border-t border-foreground">
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              {items.filter(i => i.completed).length} / {items.length} completed
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
