'use client';

import {Briefcase, GraduationCap, HandHeart} from 'lucide-react';
import {useMemo, useState} from 'react';

import {Button} from '@/components/ui/button';
import {RetroCard} from '@/components/ui/retro-card';
import {siteConfig} from '@/config/site';
import bio from '@/data/bio.json';

function formatDateRange(start: string, end?: string) {
  const startDate = new Date(start);
  const endDate =
    !end || end.toLowerCase() === 'present' ? 'Present' : new Date(end);
  const startStr = startDate.toLocaleString('default', {
    month: 'short',
    year: 'numeric',
  });
  const endStr =
    endDate === 'Present'
      ? 'Present'
      : endDate.toLocaleString('default', {month: 'short', year: 'numeric'});
  return `${startStr} - ${endStr}`;
}

type WorkItem = (typeof bio.experience)[0] & {
  type: 'work';
  start: string;
  end?: string;
};
type EducationItem = (typeof bio.education)[0] & {
  type: 'education';
  start: string;
  end?: string;
};
type VolunteerItem = (typeof bio.volunteer)[0] & {
  type: 'volunteer';
  start: string;
  end?: string;
};
type TimelineItem = WorkItem | EducationItem | VolunteerItem;

export function AboutContent() {
  const [filter, setFilter] = useState<
    'all' | 'work' | 'education' | 'volunteer'
  >('all');

  const timelineItems = useMemo(() => {
    const workItems: TimelineItem[] = bio.experience.map(job => ({
      ...job,
      type: 'work',
      start: job.startDate,
      end: job.endDate,
    }));
    const volunteerItems: TimelineItem[] = bio.volunteer.map(volunteer => ({
      ...volunteer,
      type: 'volunteer',
      start: volunteer.startDate,
      end: volunteer.endDate,
    }));
    const educationItems: TimelineItem[] = bio.education.map(edu => ({
      ...edu,
      type: 'education',
      start: edu.startDate,
      end: edu.endDate,
    }));

    const allItems = [...workItems, ...volunteerItems, ...educationItems];

    allItems.sort((a, b) => {
      const getEndDate = (item: TimelineItem) => {
        if (!item.end || item.end.toLowerCase() === 'present') {
          return new Date().getTime() + 1;
        }
        return new Date(item.end).getTime();
      };
      return getEndDate(b) - getEndDate(a);
    });

    return allItems;
  }, []);

  const filteredItems = useMemo(() => {
    if (filter === 'all') {
      return timelineItems;
    }
    return timelineItems.filter(item => item.type === filter);
  }, [filter, timelineItems]);

  return (
    <div className="container pt-24 pb-32">
      <div className="mx-auto max-w-4xl relative">
        <header className="text-center mb-12">
          <h1 className="font-headline text-4xl font-extrabold tracking-tight lg:text-5xl">
            My Journey
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {siteConfig.nav['/about'].description}
          </p>
        </header>

        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          <Button
            variant={filter === 'all' ? 'default' : 'secondary'}
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'work' ? 'default' : 'secondary'}
            onClick={() => setFilter('work')}
          >
            Work
          </Button>
          <Button
            variant={filter === 'volunteer' ? 'default' : 'secondary'}
            onClick={() => setFilter('volunteer')}
          >
            Volunteer
          </Button>
          <Button
            variant={filter === 'education' ? 'default' : 'secondary'}
            onClick={() => setFilter('education')}
          >
            Education
          </Button>
        </div>

        <section>
          <div className="relative space-y-8 md:space-y-16 before:absolute before:inset-y-0 before:w-0.5 before:bg-border before:left-5 before:-translate-x-px md:before:left-1/2 md:before:-translate-x-1/2">
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <div key={`${item.type}-${index}`} className="relative">
                  <div className="absolute left-5 top-0 -translate-x-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shrink-0 z-10 md:left-1/2">
                    {(() => {
                      switch (item.type) {
                        case 'work':
                          return <Briefcase className="h-5 w-5" />;
                        case 'education':
                          return <GraduationCap className="h-5 w-5" />;
                        case 'volunteer':
                          return <HandHeart className="h-5 w-5" />;
                        default:
                          return null;
                      }
                    })()}
                  </div>
                  <div
                    className={`w-full pl-16 md:w-1/2 ${
                      index % 2 === 0
                        ? 'md:pl-0 md:pr-12'
                        : 'md:ml-auto md:pl-12'
                    }`}
                  >
                    <RetroCard
                      title={(() => {
                        switch (item.type) {
                          case 'work':
                            return item.title;
                          case 'education':
                            return item.degree;
                          case 'volunteer':
                            return item.role;
                          default:
                            return '';
                        }
                      })()}
                      description={
                        <div className="text-sm">
                          <p className="font-semibold text-primary mb-1">
                            {(() => {
                              switch (item.type) {
                                case 'work':
                                  return item.company;
                                case 'education':
                                  return item.institution;
                                case 'volunteer':
                                  return item.organization;
                                default:
                                  return '';
                              }
                            })()}
                          </p>
                          <p className="text-xs text-primary/80 mb-4">
                            {formatDateRange(item.start, item.end)}
                          </p>
                          {Array.isArray(item.description) ? (
                            <ul className="list-disc pl-5 space-y-2">
                              {item.description.map((desc, i) => (
                                <li key={i}>{desc}</li>
                              ))}
                            </ul>
                          ) : (
                            <p>{item.description}</p>
                          )}
                        </div>
                      }
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No items to display for this filter.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
