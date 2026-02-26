import React, { useEffect } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import ResumeForm from '../../components/resume-builder/ResumeForm';
import ResumePreview from '../../components/resume-builder/ResumePreview';
import { FileText, Download, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ResumeBuilder = () => {
  // We can add a specialized hook here later for data persistence
  const { loadDemoData } = useResumeStore();

  useEffect(() => {
    // Optional: Load demo data for viewing pleasure on first mount
    // loadDemoData(); 
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col h-screen w-full bg-neutral-50 overflow-hidden font-sans">
      {/* Header */}
      <div className="h-14 border-b border-neutral-200 bg-white flex items-center px-6 justify-between z-20 print:hidden shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-sm">
            <FileText className="w-5 h-5" />
          </div>
          <span className="font-bold text-neutral-800 tracking-tight">Resume<span className="text-indigo-600">Builder</span></span>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={loadDemoData} className="text-neutral-500 hover:text-neutral-900">
            <RotateCcw className="w-4 h-4 mr-2" /> Load Demo
          </Button>
          <Button size="sm" onClick={handlePrint} className="bg-neutral-900 text-white hover:bg-neutral-800 shadow-sm">
            <Download className="w-4 h-4 mr-2" /> Download PDF
          </Button>
        </div>
      </div>

      {/* Split Screen Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Form Wizard (40% width on large screens) */}
        <div className="w-full lg:w-[45%] border-r border-neutral-200 bg-white relative z-10 print:hidden h-full">
          <ResumeForm />
        </div>

        {/* Right Side: Live Preview (60% width) */}
        <div className="hidden lg:flex lg:w-[55%] bg-neutral-100 items-start justify-center overflow-y-auto relative print:w-full print:block print:bg-white print:p-0 print:absolute print:inset-0 print:z-50 p-8">
          <div className="scale-[0.8] origin-top transform transition-transform duration-300 print:transform-none">
            <ResumePreview />
          </div>
        </div>
      </div>

      {/* Mobile Preview Overlay (Optional/Future) */}
      <div className="lg:hidden absolute bottom-0 left-0 right-0 bg-white border-t p-4 print:hidden">
        <p className="text-center text-sm text-neutral-500">Switch to desktop to view live preview</p>
      </div>
    </div>
  );
};

export default ResumeBuilder;