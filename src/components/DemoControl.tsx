import { useState } from 'react';
import { Play, Sparkles, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useStore } from '../store/useStore';
import { addDays } from 'date-fns';

const DemoControl = () => {
    const [isRunning, setIsRunning] = useState(false);
    const [step, setStep] = useState(0);
    const addWorkOrder = useStore(state => state.addWorkOrder);
    const updateWorkOrder = useStore(state => state.updateWorkOrder);

    const runDemo = () => {
        if (isRunning) return;
        setIsRunning(true);
        setStep(0);

        // T+0s: Toast
        toast("New Incident Reported", {
            description: "HVAC Unit 5 - High vibration detected via IoT sensor.",
            duration: 5000,
        });

        // T+2s: Create Work Order
        setTimeout(() => {
            setStep(1);
            const newWO = {
                id: 'WO-DEMO-01',
                title: 'IoT Alert: HVAC Unit 5 Vibration',
                description: 'Abnormal vibration levels detected > 5mm/s. Immediate inspection required.',
                priority: 'high' as const,
                status: 'open' as const,
                category: 'HVAC',
                location: 'Roof - Sector B',
                createdAt: new Date(),
                dueDate: addDays(new Date(), 2),
                assignedTo: undefined,
            };
            addWorkOrder(newWO);
            toast.info("Work Order Created: WO-DEMO-01");
        }, 2000);

        // T+5s: AI Suggest
        setTimeout(() => {
            setStep(2);
            toast("AI Analysis Complete", {
                icon: <Sparkles className="w-4 h-4 text-primary" />,
                description: "Recommended Technician: Sarah Connor (Availability: 100%, Skill: HVAC)",
            });
        }, 5000);

        // T+8s: Auto Assign
        setTimeout(() => {
            setStep(3);
            updateWorkOrder('WO-DEMO-01', {
                status: 'assigned',
                assignedTo: { id: 'u3', name: 'Sarah Connor', role: 'technician', avatar: 'SC' }
            });
            toast.success("Technician Assigned: Sarah Connor");
        }, 8000);

        // T+10s: WhatsApp Mock (Just a toast for now saying sent)
        setTimeout(() => {
            setStep(4);
            toast.message("Notification Sent", {
                description: "WhatsApp message delivered to Sarah Connor (+1 555-0123)",
            });
        }, 10000);

        // T+15s: In Progress
        setTimeout(() => {
            setStep(5);
            updateWorkOrder('WO-DEMO-01', { status: 'in_progress' });
            toast.info("Status Updated: In Progress");
        }, 15000);

        // T+25s: Completed
        setTimeout(() => {
            setStep(6);
            updateWorkOrder('WO-DEMO-01', { status: 'completed' });
            toast.success("Work Order Completed!", {
                description: "Maintenance performed. Vibration levels normal.",
            });
            setIsRunning(false);
        }, 25000);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-2">
            {isRunning && (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200 mb-2 w-64">
                    <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Demo Sequence</div>
                    <div className="space-y-2">
                        <StepItem active={step === 1} done={step > 1} label="Create Work Order" />
                        <StepItem active={step === 2} done={step > 2} label="AI Analysis" />
                        <StepItem active={step === 3} done={step > 3} label="Auto-Assign" />
                        <StepItem active={step === 4} done={step > 4} label="Notify Tech" />
                        <StepItem active={step === 6} done={step > 6} label="Complete" />
                    </div>
                </div>
            )}
            <button
                onClick={runDemo}
                disabled={isRunning}
                className={`flex items-center px-4 py-3 rounded-full font-bold shadow-lg transition-all ${isRunning ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-primary text-white hover:bg-green-800 hover:scale-105'}`}
            >
                {isRunning ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Play className="w-5 h-5 mr-2" />}
                {isRunning ? 'Demo Running...' : 'Run Demo'}
            </button>
        </div>
    );
};

const StepItem = ({ active, done, label }: { active: boolean, done: boolean, label: string }) => (
    <div className={`flex items-center text-xs ${active ? 'text-primary font-bold' : done ? 'text-gray-400' : 'text-gray-300'}`}>
        <div className={`w-4 h-4 rounded-full flex items-center justify-center mr-2 ${active ? 'bg-primary text-white' : done ? 'bg-green-100 text-green-600' : 'bg-gray-100'}`}>
            {done ? <Check className="w-3 h-3" /> : active ? <Loader2 className="w-3 h-3 animate-spin" /> : <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />}
        </div>
        {label}
    </div>
);

export default DemoControl;
