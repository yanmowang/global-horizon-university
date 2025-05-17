import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const CertificateRequestForm = () => {
  const [formData, setFormData] = useState({
    program: '',
    certificateType: 'bachelor',
    graduationDate: '',
    gpa: '',
    honors: '',
    additionalInfo: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('You must be logged in to request a certificate');
      }

      // Prepare the request payload
      const payload = {
        program: formData.program,
        certificateType: formData.certificateType,
        metadata: {
          graduationDate: formData.graduationDate ? new Date(formData.graduationDate) : undefined,
          gpa: formData.gpa ? parseFloat(formData.gpa) : undefined,
          honors: formData.honors,
          additionalInfo: formData.additionalInfo,
        },
      };

      // Send request to API
      const response = await fetch('/api/certificates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit certificate request');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (err) {
      console.error('Certificate request error:', err);
      setError(err.message || 'An error occurred while submitting your request');
    } finally {
      setLoading(false);
    }
  };

  const certificateTypes = [
    { value: 'bachelor', label: "Bachelor's Degree" },
    { value: 'master', label: "Master's Degree" },
    { value: 'phd', label: 'Doctoral Degree' },
    { value: 'professional', label: 'Professional Certificate' },
  ];

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600">Authentication Required</h2>
            <p className="mt-2 text-gray-600">You must be logged in to request a certificate.</p>
            <button
              onClick={() => navigate('/login')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-blue-900 text-white">
            <h2 className="text-xl font-semibold">Request a Certificate</h2>
            <p className="mt-1 text-sm">Fill out the form to request your academic certificate</p>
          </div>

          {success ? (
            <div className="p-6">
              <div className="bg-green-50 border border-green-200 rounded-md p-4 text-green-800">
                <div className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-600 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="font-medium">Certificate request submitted successfully!</p>
                </div>
                <p className="mt-2 text-sm">
                  Your request has been received and is being processed. You will be redirected to
                  your dashboard shortly.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6">
              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4 text-red-800">
                  <div className="flex items-center">
                    <svg
                      className="h-5 w-5 text-red-600 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="font-medium">{error}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="program" className="block text-sm font-medium text-gray-700">
                    Program Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="program"
                    id="program"
                    required
                    value={formData.program}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. Computer Science, Business Administration"
                  />
                </div>

                <div>
                  <label
                    htmlFor="certificateType"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Certificate Type <span className="text-red-600">*</span>
                  </label>
                  <select
                    name="certificateType"
                    id="certificateType"
                    required
                    value={formData.certificateType}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    {certificateTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="graduationDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Graduation Date
                  </label>
                  <input
                    type="date"
                    name="graduationDate"
                    id="graduationDate"
                    value={formData.graduationDate}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="gpa" className="block text-sm font-medium text-gray-700">
                    GPA
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="4.0"
                    name="gpa"
                    id="gpa"
                    value={formData.gpa}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. 3.8"
                  />
                </div>

                <div>
                  <label htmlFor="honors" className="block text-sm font-medium text-gray-700">
                    Honors/Awards
                  </label>
                  <input
                    type="text"
                    name="honors"
                    id="honors"
                    value={formData.honors}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. Cum Laude, Dean's List"
                  />
                </div>

                <div>
                  <label
                    htmlFor="additionalInfo"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Additional Information
                  </label>
                  <textarea
                    name="additionalInfo"
                    id="additionalInfo"
                    rows="3"
                    value={formData.additionalInfo}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Any additional information you'd like to provide"
                  ></textarea>
                </div>

                <div className="flex items-center text-sm text-gray-600 mt-2">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p>
                    Fields marked with <span className="text-red-600">*</span> are required.
                  </p>
                </div>

                <div className="mt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      loading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? 'Submitting...' : 'Submit Certificate Request'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CertificateRequestForm;
