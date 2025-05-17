import React, { useState } from 'react';

const VerifyPage = () => {
  const [certificateId, setCertificateId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = e => {
    setCertificateId(e.target.value);
    // Clear previous results when input changes
    setVerificationResult(null);
    setError('');
  };

  const handleVerify = async e => {
    e.preventDefault();

    if (!certificateId.trim()) {
      setError('Please enter a certificate ID');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      // In a real application, this would be an API call
      // For demo purposes, we'll simulate an API response

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Example verification logic (replace with actual API call)
      if (certificateId === 'GHU-2023-1234') {
        setVerificationResult({
          status: 'Valid',
          name: 'John Doe',
          program: 'Master of Business Administration (MBA)',
          date: '2023-06-15',
        });
      } else {
        setVerificationResult({
          status: 'Invalid',
          message: 'Certificate not found in our database',
        });
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError('An error occurred during verification. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-10 p-6">
      <h1 className="text-3xl font-bold text-center text-blue-900 mb-6">
        Certificate Verification
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-700 mb-4">
          Enter the certificate ID to verify its authenticity. Valid certificates will display the
          recipient's name, program, and issue date.
        </p>

        <form onSubmit={handleVerify} className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={certificateId}
              onChange={handleInputChange}
              placeholder="Enter Certificate ID (e.g., GHU-2023-1234)"
              className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={isVerifying}
              className={`px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition duration-300 ${
                isVerifying ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isVerifying ? 'Verifying...' : 'Verify Certificate'}
            </button>
          </div>
          {error && <p className="mt-2 text-red-500">{error}</p>}
        </form>

        {verificationResult && (
          <div
            className={`mt-6 p-4 rounded-lg ${
              verificationResult.status === 'Valid'
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            <h2
              className={`text-xl font-semibold mb-2 ${
                verificationResult.status === 'Valid' ? 'text-green-700' : 'text-red-700'
              }`}
            >
              Certificate Status: {verificationResult.status}
            </h2>

            {verificationResult.status === 'Valid' ? (
              <div className="mt-4 space-y-2">
                <p className="text-gray-700">
                  <span className="font-semibold">Name:</span> {verificationResult.name}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Program:</span> {verificationResult.program}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Issue Date:</span> {verificationResult.date}
                </p>
                <div className="mt-4 pt-4 border-t border-green-200">
                  <p className="text-green-700 font-medium">
                    This certificate has been verified as authentic and issued by Global Horizon
                    University.
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-red-700 mt-2">{verificationResult.message}</p>
            )}
          </div>
        )}
      </div>

      <div className="mt-8 bg-blue-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold text-blue-900 mb-2">
          How Certificate Verification Works
        </h2>
        <p className="text-gray-700">
          Each certificate issued by Global Horizon University contains a unique identifier that can
          be verified through our secure database. This verification system ensures the authenticity
          of all certificates issued by our institution.
        </p>
      </div>
    </div>
  );
};

export default VerifyPage;
