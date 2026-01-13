import React from "react";
import { Person, ChatType } from "@/types/chat";
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Users, HelpCircle, Camera, User, Trash2, Plus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { readFileAsDataURL } from "@/lib/image-utils";

interface PeopleSectionProps {
    people: Person[];
    chatType: ChatType;
    onUpdatePerson: (person: Person) => void;
    onAddPerson: () => void;
    onRemovePerson: (id: string) => void;
}

export function PeopleSection({
    people,
    chatType,
    onUpdatePerson,
    onAddPerson,
    onRemovePerson
}: PeopleSectionProps) {
    const senderPerson = people.find(p => p.id === 'user');
    const receiverPeople = people.filter(p => p.id !== 'user');

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, person: Person) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const result = await readFileAsDataURL(file);
                onUpdatePerson({ ...person, avatar: result });
            } catch (error) {
                console.error("Error reading image:", error);
            }
        }
    };

    return (
        <AccordionItem value="people" className="border rounded-xl bg-card shadow-sm overflow-hidden">
            <AccordionTrigger className="hover:no-underline px-3 py-3 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Users className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="font-semibold text-sm">People</span>
                    <span className="ml-1 w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium text-muted-foreground">
                        {people.length}
                    </span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="px-3 pb-3 pt-1 space-y-3">
                {/* Sender Section */}
                <div>
                    <div className="flex items-center gap-1.5 mb-2">
                        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Sender</span>
                        <Tooltip>
                            <TooltipTrigger>
                                <HelpCircle className="w-3 h-3 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="text-xs">The person sending messages (you)</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                    {senderPerson && (
                        <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-secondary/40 border border-border/50">
                            <label className="cursor-pointer relative group flex-shrink-0">
                                {senderPerson.avatar ? (
                                    <img src={senderPerson.avatar} alt={senderPerson.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-primary/20" />
                                ) : (
                                    <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
                                        <User className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <Camera className="w-3.5 h-3.5 text-white" />
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleImageChange(e, senderPerson)}
                                />
                            </label>
                            <Input
                                value={senderPerson.name}
                                onChange={(e) => onUpdatePerson({ ...senderPerson, name: e.target.value })}
                                className="h-9 text-sm flex-1 bg-background"
                            />
                        </div>
                    )}
                </div>

                {/* Receiver Section */}
                <div>
                    <div className="flex items-center gap-1.5 mb-2">
                        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Receiver</span>
                        <Tooltip>
                            <TooltipTrigger>
                                <HelpCircle className="w-3 h-3 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="text-xs">The person receiving messages</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                    <div className="space-y-2">
                        {receiverPeople.map((person) => (
                            <div key={person.id} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-secondary/40 border border-border/50">
                                <label className="cursor-pointer relative group flex-shrink-0">
                                    {person.avatar ? (
                                        <img src={person.avatar} alt={person.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-primary/20" />
                                    ) : (
                                        <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
                                            <User className="w-4 h-4 text-muted-foreground" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <Camera className="w-3.5 h-3.5 text-white" />
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleImageChange(e, person)}
                                    />
                                </label>
                                <Input
                                    value={person.name}
                                    onChange={(e) => onUpdatePerson({ ...person, name: e.target.value })}
                                    className="h-9 text-sm flex-1 bg-background"
                                />
                                {people.length > 2 && (
                                    <button
                                        onClick={() => onRemovePerson(person.id)}
                                        className="p-1.5 rounded-lg text-destructive/60 hover:text-destructive hover:bg-destructive/10 transition-colors"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    {chatType === 'group' && (
                        <Button onClick={onAddPerson} variant="outline" size="sm" className="w-full mt-2 gap-1.5 h-8 text-xs">
                            <Plus className="w-3.5 h-3.5" />
                            Add Person
                        </Button>
                    )}
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}
