import React from 'react';
import { COURSES } from '../data/courses';

export const CoursesPage: React.FC = () => {
  return (
    <div className="space-y-8 px-6">
      <h1 className="text-4xl font-bold">Our Courses</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {COURSES.map((course) => (
          <div key={course.id} className="p-6 bg-white rounded-xl border border-emerald-100 shadow-sm">
            <h3 className="text-xl font-semibold text-emerald-900">{course.name}</h3>
            <p className="text-gray-600 mt-2">{course.shortDesc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
