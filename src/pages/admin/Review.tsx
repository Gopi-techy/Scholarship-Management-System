import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import type { Application } from '../../types';

const Review: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewNote, setReviewNote] = useState('');
  const [decision, setDecision] = useState<{
    status: 'approved' | 'rejected';
    comments: string;
    awardAmount?: number;
  }>({
    status: 'approved',
    comments: '',
    awardAmount: 0,
  });

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await api.get(`/applications/${id}`);
        setApplication(response.data.data);
      } catch (error) {
        toast.error('Failed to fetch application details');
        navigate('/admin');
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id, navigate]);

  const handleAddNote = async () => {
    if (!reviewNote.trim()) return;

    try {
      const response = await api.post(`/applications/${id}/notes`, {
        note: reviewNote,
      });
      setApplication(response.data.data);
      setReviewNote('');
      toast.success('Note added successfully');
    } catch (error) {
      toast.error('Failed to add note');
    }
  };

  const handleSubmitDecision = async () => {
    try {
      const response = await api.post(`/applications/${id}/review`, decision);
      setApplication(response.data.data);
      toast.success('Decision submitted successfully');
      navigate('/admin');
    } catch (error) {
      toast.error('Failed to submit decision');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-muted-foreground">Application not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Application Review
          </h1>
          <button
            onClick={() => navigate('/admin')}
            className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="space-y-8">
          {/* Student Information */}
          <div className="bg-card rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-card-foreground">
              Student Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="text-foreground">
                  {application.student.profile.firstName}{' '}
                  {application.student.profile.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-foreground">{application.student.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Institution</p>
                <p className="text-foreground">
                  {application.student.academicInfo?.institution}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">GPA</p>
                <p className="text-foreground">
                  {application.academicInfo.currentGPA}
                </p>
              </div>
            </div>
          </div>

          {/* Application Details */}
          <div className="bg-card rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-card-foreground">
              Application Details
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Scholarship Type</p>
                <p className="text-foreground">{application.scholarshipType}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Academic Period</p>
                <p className="text-foreground">
                  {application.academicYear} - {application.semester}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Financial Information</p>
                <p className="text-foreground">
                  Family Income: ${application.financialInfo.familyIncome}
                  <br />
                  Employment Status: {application.financialInfo.employmentStatus}
                </p>
              </div>
            </div>
          </div>

          {/* Review Notes */}
          <div className="bg-card rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-card-foreground">
              Review Notes
            </h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="review-note"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Add Note
                </label>
                <textarea
                  id="review-note"
                  rows={3}
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  placeholder="Enter your review notes here..."
                />
                <button
                  onClick={handleAddNote}
                  className="mt-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
                >
                  Add Note
                </button>
              </div>
              <div className="space-y-2">
                {application.reviewNotes?.map((note, index) => (
                  <div
                    key={index}
                    className="p-3 bg-muted rounded-md text-sm text-foreground"
                  >
                    <p className="text-muted-foreground">
                      {new Date(note.timestamp).toLocaleString()}
                    </p>
                    <p className="mt-1">{note.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Decision */}
          <div className="bg-card rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-card-foreground">
              Decision
            </h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="decision-status"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Status
                </label>
                <select
                  id="decision-status"
                  value={decision.status}
                  onChange={(e) =>
                    setDecision((prev) => ({
                      ...prev,
                      status: e.target.value as 'approved' | 'rejected',
                    }))
                  }
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {decision.status === 'approved' && (
                <div>
                  <label
                    htmlFor="award-amount"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Award Amount ($)
                  </label>
                  <input
                    id="award-amount"
                    type="number"
                    value={decision.awardAmount}
                    onChange={(e) =>
                      setDecision((prev) => ({
                        ...prev,
                        awardAmount: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    min="0"
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="decision-comments"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Comments
                </label>
                <textarea
                  id="decision-comments"
                  rows={3}
                  value={decision.comments}
                  onChange={(e) =>
                    setDecision((prev) => ({
                      ...prev,
                      comments: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  placeholder="Enter decision comments..."
                />
              </div>

              <button
                onClick={handleSubmitDecision}
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Submit Decision
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review; 