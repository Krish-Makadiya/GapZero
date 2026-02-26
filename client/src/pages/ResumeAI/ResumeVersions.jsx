import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, FileText, Calendar, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

const ResumeVersions = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('resumeHistory') || '[]');
    setHistory(storedHistory);
  }, []);

  const clearHistory = () => {
    if (confirm("Are you sure you want to clear all history?")) {
      localStorage.removeItem('resumeHistory');
      setHistory([]);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Version History</h1>
          <p className="text-muted-foreground mt-2">
            View your past resume refinements and AI analysis results.
          </p>
        </div>
        {history.length > 0 && (
          <Button variant="outline" className="text-destructive hover:bg-destructive/10" onClick={clearHistory}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear History
          </Button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-xl bg-muted/30">
          <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No versions found</h3>
          <p className="text-muted-foreground">
            Refine a resume in the ATS Scanner to see it here.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {history.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="space-y-1">
                    <CardTitle className="text-base font-semibold line-clamp-2" title={item.fullJobDescription}>
                      {item.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 text-xs">
                      <Calendar className="w-3 h-3" />
                      {item.date ? format(new Date(item.date), 'PP p') : 'Unknown Date'}
                    </CardDescription>
                  </div>
                  <Badge variant={item.quantificationScore === "High" ? "default" : "secondary"}>
                    {item.quantificationScore || 'N/A'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span>Improvement: Make it measurable</span>
                  </div>

                  <div className="bg-muted/50 p-3 rounded-md text-xs font-mono mb-2 max-h-24 overflow-hidden text-ellipsis line-clamp-3">
                    {item.improvementPlan?.suggestedRewrite || "No rewrite suggestion available."}
                  </div>

                  {item.fluffPhrases && item.fluffPhrases.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.fluffPhrases.slice(0, 3).map((phrase, i) => (
                        <Badge key={i} variant="outline" className="text-[10px] px-1 py-0 border-red-200 text-red-500">
                          {phrase}
                        </Badge>
                      ))}
                      {item.fluffPhrases.length > 3 && (
                        <span className="text-[10px] text-muted-foreground self-center">+{item.fluffPhrases.length - 3} more</span>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResumeVersions;