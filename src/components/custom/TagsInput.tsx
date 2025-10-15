import React, { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';

interface TagsInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
}

const TagsInput: React.FC<TagsInputProps> = ({ tags, setTags }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      const newTag = inputValue.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
        setInputValue('');
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map(tag => (
          <div key={tag} className="flex items-center bg-gray-700 text-white rounded-full px-3 py-1 text-sm">
            {tag}
            <button onClick={() => removeTag(tag)} className="ml-2">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add tags..."
        className="w-full bg-transparent border-b border-gray-500 focus:outline-none focus:border-green-500"
      />
    </div>
  );
};

export default TagsInput;
