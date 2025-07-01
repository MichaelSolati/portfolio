import {generatePageMetadata} from '@/lib/metadata';

import {AboutContent} from './content';

export const metadata = await generatePageMetadata({pathname: '/about'});

export default function AboutPage() {
  return <AboutContent />;
}
