import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import type { Document } from '../../types';

interface ApplicationFormData {
  scholarshipType: string;
  academicYear: string;
  semester: string;
  financialInfo: {
    familyIncome: number;
    otherScholarships: string[];
    employmentStatus: 'employed' | 'unemployed' | 'part_time';
  };
  academicInfo: {
    currentGPA: number;
    creditHours: number;
    academicAchievements: string[];
  };
  documents: Document[];
}

const Application: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ApplicationFormData>({
    scholarshipType: '',
    academicYear: new Date().getFullYear().toString(),
    semester: '',
    financialInfo: {
      familyIncome: 0,
      otherScholarships: [],
      employmentStatus: 'unemployed',
    },
    academicInfo: {
      currentGPA: 0,
      creditHours: 0,
      academicAchievements: [],
    },
    documents: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData((prev) => {
        const sectionData = prev[section as keyof typeof prev];
        if (typeof sectionData === 'object' && sectionData !== null) {
          return {
            ...prev,
            [section]: {
              ...sectionData,
              [field]: value,
            },
          };
        }
        return prev;
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'transcript'); // You can make this dynamic

    try {
      const response = await api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFormData((prev) => ({
        ...prev,
        documents: [...prev.documents, response.data.data],
      }));
      toast.success('Document uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload document');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    setLoading(true);
    try {
      await api.post('/applications', formData);
      toast.success('Application submitted successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="scholarshipType" className="block text-sm font-medium text-foreground">
                Scholarship Type
              </label>
              <select
                id="scholarshipType"
                name="scholarshipType"
                value={formData.scholarshipType}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-input bg-background px-3 py-2"
                required
                aria-label="Scholarship Type"
              >
                <option value="">Select type</option>
                <option value="merit">Merit-based</option>
                <option value="need">Need-based</option>
                <option value="athletic">Athletic</option>
              </select>
            </div>
            <div>
              <label htmlFor="academicYear" className="block text-sm font-medium text-foreground">
                Academic Year
              </label>
              <input
                id="academicYear"
                type="text"
                name="academicYear"
                value={formData.academicYear}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-input bg-background px-3 py-2"
                required
                aria-label="Academic Year"
              />
            </div>
            <div>
              <label htmlFor="semester" className="block text-sm font-medium text-foreground">
                Semester
              </label>
              <select
                id="semester"
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-input bg-background px-3 py-2"
                required
                aria-label="Semester"
              >
                <option value="">Select semester</option>
                <option value="Fall">Fall</option>
                <option value="Spring">Spring</option>
                <option value="Summer">Summer</option>
              </select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="familyIncome" className="block text-sm font-medium text-foreground">
                Family Income
              </label>
              <input
                id="familyIncome"
                type="number"
                name="financialInfo.familyIncome"
                value={formData.financialInfo.familyIncome}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-input bg-background px-3 py-2"
                required
                aria-label="Family Income"
              />
            </div>
            <div>
              <label htmlFor="employmentStatus" className="block text-sm font-medium text-foreground">
                Employment Status
              </label>
              <select
                id="employmentStatus"
                name="financialInfo.employmentStatus"
                value={formData.financialInfo.employmentStatus}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-input bg-background px-3 py-2"
                required
                aria-label="Employment Status"
              >
                <option value="unemployed">Unemployed</option>
                <option value="employed">Employed</option>
                <option value="part_time">Part Time</option>
              </select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="currentGPA" className="block text-sm font-medium text-foreground">
                Current GPA
              </label>
              <input
                id="currentGPA"
                type="number"
                step="0.01"
                name="academicInfo.currentGPA"
                value={formData.academicInfo.currentGPA}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-input bg-background px-3 py-2"
                required
                aria-label="Current GPA"
              />
            </div>
            <div>
              <label htmlFor="creditHours" className="block text-sm font-medium text-foreground">
                Credit Hours
              </label>
              <input
                id="creditHours"
                type="number"
                name="academicInfo.creditHours"
                value={formData.academicInfo.creditHours}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-input bg-background px-3 py-2"
                required
                aria-label="Credit Hours"
              />
            </div>
            <div>
              <label htmlFor="documentUpload" className="block text-sm font-medium text-foreground">
                Upload Documents
              </label>
              <input
                id="documentUpload"
                type="file"
                onChange={handleFileUpload}
                className="mt-1 block w-full"
                accept=".pdf,.doc,.docx"
                aria-label="Upload Documents"
              />
            </div>
            <div className="mt-2">
              {formData.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="text-sm text-muted-foreground flex items-center gap-2"
                >
                  <span>✓</span>
                  <span>{doc.type}</span>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          Scholarship Application
        </h1>

        <div className="bg-card rounded-lg shadow-lg p-6">
          <div className="mb-8 flex justify-between">
            {[1, 2, 3].map((number) => (
              <div
                key={number}
                className={`flex items-center ${
                  number <= step ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    number <= step
                      ? 'border-primary bg-primary/10'
                      : 'border-muted'
                  }`}
                >
                  {number}
                </div>
                <span className="ml-2">
                  {number === 1
                    ? 'Basic Info'
                    : number === 2
                    ? 'Financial Info'
                    : 'Academic Info'}
                </span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {renderStep()}

            <div className="mt-8 flex justify-between">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
              >
                {loading
                  ? 'Submitting...'
                  : step === 3
                  ? 'Submit Application'
                  : 'Next'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Application; 