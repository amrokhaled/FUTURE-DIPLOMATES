"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Trash2, Edit2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Assuming Textarea component exists, otherwise Input
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface Summit {
    id: string;
    city: string;
    dates: string;
    image_url: string;
    description: string;
    is_active: boolean;
}

export default function SummitsCMS() {
    const [summits, setSummits] = useState<Summit[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingSummit, setEditingSummit] = useState<Summit | null>(null);

    // Form State
    const [city, setCity] = useState("");
    const [dates, setDates] = useState("");
    const [image, setImage] = useState("");
    const [desc, setDesc] = useState("");

    const supabase = createClient();

    useEffect(() => {
        fetchSummits();
    }, []);

    async function fetchSummits() {
        const { data } = await supabase.from('summits').select('*').order('created_at');
        if (data) setSummits(data);
        setLoading(false);
    }

    function resetForm() {
        setCity("");
        setDates("");
        setImage("");
        setDesc("");
        setEditingSummit(null);
    }

    function loadForEdit(summit: Summit) {
        setEditingSummit(summit);
        setCity(summit.city);
        setDates(summit.dates);
        setImage(summit.image_url);
        setDesc(summit.description);
    }

    async function handleSave() {
        if (editingSummit) {
            // Update
            const { error } = await supabase
                .from('summits')
                .update({ city, dates, image_url: image, description: desc })
                .eq('id', editingSummit.id);

            if (!error) fetchSummits();
        } else {
            // Insert
            const { error } = await supabase
                .from('summits')
                .insert([{ city, dates, image_url: image, description: desc, is_active: true }]);

            if (!error) fetchSummits();
        }
        resetForm();
    }

    async function handleDelete(id: string) {
        if (confirm("Are you sure you want to delete this summit?")) {
            const { error } = await supabase.from('summits').delete().eq('id', id);
            if (!error) fetchSummits();
        }
    }

    async function toggleActive(id: string, current: boolean) {
        const { error } = await supabase
            .from('summits')
            .update({ is_active: !current })
            .eq('id', id);
        if (!error) fetchSummits();
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Summits CMS</h1>
                    <p className="text-slate-500">Manage upcoming summits displayed on the website.</p>
                </div>

                <Dialog onOpenChange={(open) => !open && resetForm()}>
                    <DialogTrigger asChild>
                        <Button onClick={resetForm}><Plus className="h-4 w-4 mr-2" /> Add New Summit</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingSummit ? 'Edit Summit' : 'Add New Summit'}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div>
                                <label className="text-sm font-medium">City Name</label>
                                <Input value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. Cairo, Egypt" />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Dates</label>
                                <Input value={dates} onChange={e => setDates(e.target.value)} placeholder="e.g. July 15-20, 2026" />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Image URL</label>
                                <Input value={image} onChange={e => setImage(e.target.value)} placeholder="https://..." />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Description</label>
                                {/* Fallback to Input if Textarea is missing in UI lib, but preferred textarea */}
                                <Input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Short description..." />
                            </div>
                            <Button onClick={handleSave} className="w-full">
                                {editingSummit ? 'Update Summit' : 'Create Summit'}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {loading ? <div>Loading content...</div> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {summits.map((summit) => (
                        <Card key={summit.id} className={!summit.is_active ? 'opacity-60' : ''}>
                            <div className="h-48 w-full relative bg-slate-200">
                                <img src={summit.image_url} alt={summit.city} className="w-full h-full object-cover rounded-t-lg" />
                                {!summit.is_active && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white font-bold">
                                        HIDDEN
                                    </div>
                                )}
                            </div>
                            <CardHeader>
                                <CardTitle className="text-lg flex justify-between">
                                    {summit.city}
                                </CardTitle>
                                <p className="text-sm text-slate-500">{summit.dates}</p>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-slate-600 line-clamp-2">{summit.description}</p>
                            </CardContent>
                            <CardFooter className="flex justify-between border-t pt-4">
                                <Button variant="ghost" size="sm" onClick={() => toggleActive(summit.id, summit.is_active)}>
                                    {summit.is_active ? 'Hide' : 'Show'}
                                </Button>
                                <div className="flex gap-2">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="icon" onClick={() => loadForEdit(summit)}>
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Edit Summit</DialogTitle>
                                            </DialogHeader>
                                            <div className="space-y-4 py-4">
                                                <div>
                                                    <label className="text-sm font-medium">City Name</label>
                                                    <Input value={city} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCity(e.target.value)} placeholder="e.g. Cairo, Egypt" />
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium">Dates</label>
                                                    <Input value={dates} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDates(e.target.value)} placeholder="e.g. July 15-20, 2026" />
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium">Image URL</label>
                                                    <Input value={image} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setImage(e.target.value)} placeholder="https://..." />
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium">Description</label>
                                                    <Input value={desc} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDesc(e.target.value)} placeholder="Short description..." />
                                                </div>
                                                <Button onClick={handleSave} className="w-full">Update Summit</Button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                    <Button variant="destructive" size="icon" onClick={() => handleDelete(summit.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
