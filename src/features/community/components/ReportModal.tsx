
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const reportReasons = [
  'Spam',
  'Harassment',
  'Privacy Violation',
  'Copyright Infringement',
  'Explicit Content',
  'Other',
];

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReportSubmit: (reason: string, comment: string) => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, onReportSubmit }) => {
  const [reason, setReason] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (reason) {
      onReportSubmit(reason, comment);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-red-500/50 text-white">
        <DialogHeader>
          <DialogTitle className="text-red-400">Report Content</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-gray-400 mb-4">Please select a reason for reporting this content.</p>
          <RadioGroup onValueChange={setReason} value={reason}>
            <div className="space-y-2">
              {reportReasons.map((r) => (
                <div key={r} className="flex items-center space-x-2">
                  <RadioGroupItem value={r} id={r} />
                  <Label htmlFor={r} className="text-gray-300">{r}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
          <Textarea
            className="mt-4 bg-gray-800 border-gray-700 text-white"
            placeholder="Optional: Provide additional details..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleSubmit} disabled={!reason}>
            Submit Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportModal;
