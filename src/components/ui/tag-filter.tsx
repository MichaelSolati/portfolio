'use client';

import {Check, ChevronsUpDown, Search} from 'lucide-react';
import {useRouter} from 'next/navigation';
import * as React from 'react';

import {Button} from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {cn} from '@/lib/utils';

interface TagFilterProps {
  tags: string[];
  currentTag?: string;
}

export function TagFilter({tags, currentTag}: TagFilterProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredTags = tags.filter(tag =>
    tag.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {currentTag ? `#${currentTag}` : 'Filter by tag...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px] p-0">
        <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <input
            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Search tags..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => e.stopPropagation()}
          />
        </div>
        <div className="max-h-[300px] overflow-y-auto p-1">
          <DropdownMenuItem
            onSelect={() => {
              router.push('/blog');
              setOpen(false);
            }}
          >
            <Check
              className={cn(
                'mr-2 h-4 w-4',
                !currentTag ? 'opacity-100' : 'opacity-0',
              )}
            />
            All Posts
          </DropdownMenuItem>
          {filteredTags.map(tag => (
            <DropdownMenuItem
              key={tag}
              onSelect={() => {
                router.push(`/blog/tags/${tag}`);
                setOpen(false);
              }}
            >
              <Check
                className={cn(
                  'mr-2 h-4 w-4',
                  currentTag === tag ? 'opacity-100' : 'opacity-0',
                )}
              />
              {tag}
            </DropdownMenuItem>
          ))}
          {filteredTags.length === 0 && (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No tags found.
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
