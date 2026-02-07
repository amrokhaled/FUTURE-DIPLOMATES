"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, Loader2, CheckCircle, Play, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Course {
    id: string;
    title: string;
    description: string;
    duration: string;
    level: string;
}

interface Enrollment {
    id: string;
    status: string;
    progress: number;
    course_id: string;
}

export default function CoursesPage() {
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState<Course[]>([]);
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [enrolling, setEnrolling] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    const supabase = createClient();

    useEffect(() => {
        async function fetchData() {
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                setUserId(user.id);

                // Get all courses
                const { data: coursesData } = await supabase
                    .from('courses')
                    .select('*')
                    .eq('is_active', true)
                    .order('created_at', { ascending: false });

                if (coursesData) setCourses(coursesData);

                // Get user's enrollments
                const { data: enrollmentsData } = await supabase
                    .from('enrollments')
                    .select('id, status, progress, course_id')
                    .eq('user_id', user.id);

                if (enrollmentsData) setEnrollments(enrollmentsData);
            }

            setLoading(false);
        }

        fetchData();
    }, [supabase]);

    const handleEnroll = async (courseId: string) => {
        if (!userId) return;

        setEnrolling(courseId);

        const { error } = await supabase
            .from('enrollments')
            .insert({
                user_id: userId,
                course_id: courseId,
                status: 'enrolled',
                progress: 0
            });

        if (!error) {
            setEnrollments([...enrollments, { id: Date.now().toString(), course_id: courseId, status: 'enrolled', progress: 0 }]);
        }

        setEnrolling(null);
    };

    const getEnrollment = (courseId: string) => {
        return enrollments.find(e => e.course_id === courseId);
    };

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'beginner': return 'bg-green-100 text-green-700';
            case 'intermediate': return 'bg-yellow-100 text-yellow-700';
            case 'advanced': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-brand" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
                <p className="text-gray-500">Explore and enroll in diplomacy and leadership courses.</p>
            </div>

            {/* Enrolled Courses */}
            {enrollments.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-900">Currently Enrolled</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {courses.filter(c => getEnrollment(c.id)).map((course) => {
                            const enrollment = getEnrollment(course.id)!;
                            return (
                                <div key={course.id} className="bg-white border rounded-2xl overflow-hidden shadow-sm">
                                    <div className="h-32 bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                                        <BookOpen className="w-12 h-12 text-white/80" />
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="font-bold text-lg">{course.title}</h3>
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${getLevelColor(course.level)}`}>
                                                {course.level}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{course.description}</p>
                                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                            <Clock className="w-4 h-4" />
                                            {course.duration}
                                        </div>
                                        <div className="mb-4">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-500">Progress</span>
                                                <span className="font-bold">{enrollment.progress}%</span>
                                            </div>
                                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-purple-500 rounded-full transition-all"
                                                    style={{ width: `${enrollment.progress}%` }}
                                                />
                                            </div>
                                        </div>
                                        <Button variant="gold" className="w-full">
                                            <Play className="w-4 h-4 mr-2" />
                                            Continue Learning
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Available Courses */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900">Available Courses</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.filter(c => !getEnrollment(c.id)).map((course) => (
                        <div key={course.id} className="bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                            <div className="h-32 bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
                                <BookOpen className="w-12 h-12 text-white/80" />
                            </div>
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="font-bold text-lg">{course.title}</h3>
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${getLevelColor(course.level)}`}>
                                        {course.level}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{course.description}</p>
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                    <Clock className="w-4 h-4" />
                                    {course.duration}
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => handleEnroll(course.id)}
                                    disabled={enrolling === course.id}
                                >
                                    {enrolling === course.id ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <ArrowRight className="w-4 h-4 mr-2" />
                                    )}
                                    Enroll Now
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                {courses.filter(c => !getEnrollment(c.id)).length === 0 && (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl">
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                        <p className="text-gray-600 font-medium">You're enrolled in all available courses!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
