import { Textarea } from "@workspace/ui/components/textarea";
import { Label } from "@workspace/ui/components/label"
import React from "react";
import { Button } from "@workspace/ui/components/button";
import { Send } from "lucide-react";


const LogPage = () => {

    async function createLog() {
        'use server'
        // Mutate data
      }

    return (
        <div className="flex items-center justify-center min-h-svh ">
            <div className="flex flex-col items-center justify-center gap-5">
                <Label className="text-xl font-bold" htmlFor="logs">what can i help you with?</Label>
                <div className="min-w-[40rem] flex flex-col gap-2 relative ">
                    <Textarea className="pr-12" id="logs" placeholder={'paste your logs here'} />
                    <p className="text-sm text-muted-foreground">
                        powered by llm's to help come up with useful insights
                    </p>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2"
                        disabled={true}
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}


export default LogPage;