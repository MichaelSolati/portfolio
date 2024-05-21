import linkedin from './linkedin.json';
import type {Props as ExpereienceCardProps} from '../components/ExpereienceCard';

const sortByDate = (a: ExpereienceCardProps, b: ExpereienceCardProps) => {
  if (b.end === null && a.end === null) {
    return new Date(b.start).getTime() - new Date(a.start).getTime();
  } else if (b.end === null && a.end !== null) {
    return 1;
  } else if (b.end !== null && a.end === null) {
    return -1;
  } else {
    return new Date(b.end || 0).getTime() - new Date(a.end || 0).getTime();
  }
};

export default function Home(): ExpereienceCardProps[] {
  const education = linkedin.education
    .map(e => ({
      title: e.studyType,
      subtitle: e.institution,
      description: e.area,
      start: new Date(e.startDate),
      end: e.endDate ? new Date(e.endDate) : null,
      filter: 'education',
    }))
    .sort(sortByDate)
    .slice(0, 6);

  const volunteer = linkedin.volunteer
    .map(e => ({
      title: e.position,
      subtitle: e.organization,
      description: e.summary,
      start: new Date(e.startDate),
      end: e.endDate ? new Date(e.endDate) : null,
      filter: 'volunteer',
    }))
    .sort(sortByDate)
    .slice(0, 6);

  const work = linkedin.work
    .map(e => ({
      title: e.position,
      subtitle: e.name,
      description: e.summary,
      start: new Date(e.startDate),
      end: e.endDate ? new Date(e.endDate) : null,
      filter: 'work',
    }))
    .sort(sortByDate)
    .slice(0, 6);

  const elements = [...education, ...volunteer, ...work].sort(sortByDate);

  return elements;
}
