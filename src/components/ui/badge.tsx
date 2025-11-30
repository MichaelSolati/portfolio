import * as React from 'react';

import {cn} from '@/lib/utils';

function Badge({className, ...props}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-2 border-primary bg-slate-900/50 text-primary hover:bg-primary hover:text-primary-foreground',
        className,
      )}
      {...props}
    />
  );
}

export {Badge};
