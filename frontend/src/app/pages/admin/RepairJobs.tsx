import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, X } from 'lucide-react';
import { StatusBadge } from '../../components/StatusBadge';
import { toast } from 'sonner';
import { fetchJson, jsonRequest, putRequest, deleteRequest } from '../../api';

type RepairStatus = 'Pending' | 'In Progress' | 'Completed';

interface RepairJob {
  id: number;
  jobNumber: string;
  customerCode: string;
  customerName: string;
  model: string;
  problem: string;
  status: RepairStatus;
  estimatedCost: string;
  createdAt: string;
}

export function RepairJobs() {
  const [jobs, setJobs] = useState<RepairJob[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<RepairStatus | 'All'>('All');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedJob, setSelectedJob] = useState<RepairJob | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    customerCode: '',
    customerName: '',
    model: '',
    problem: '',
    estimatedCost: '',
    status: 'Pending' as RepairStatus,
  });

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setIsLoading(true);
      const response = await fetchJson('repair_jobs.php');
      setJobs(response.data.jobs || []);
    } catch (error) {
      console.error(error);
      toast.error('Unable to load repair jobs.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.jobNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.customerCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.model.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openCreateModal = () => {
    setSelectedJob(null);
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (job: RepairJob) => {
    setSelectedJob(job);
    setFormData({
      customerCode: job.customerCode,
      customerName: job.customerName,
      model: job.model,
      problem: job.problem,
      estimatedCost: job.estimatedCost,
      status: job.status,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      customerCode: '',
      customerName: '',
      model: '',
      problem: '',
      estimatedCost: '',
      status: 'Pending',
    });
  };

  const handleCreateJob = async () => {
    if (!formData.customerName || !formData.model || !formData.problem) {
      toast.error('Please fill in the required fields.');
      return;
    }

    try {
      await jsonRequest('repair_jobs.php', {
        customerCode: formData.customerCode,
        customerName: formData.customerName,
        model: formData.model,
        problem: formData.problem,
        estimatedCost: formData.estimatedCost,
        status: formData.status,
      });
      toast.success('Repair job created successfully.');
      setShowModal(false);
      resetForm();
      loadJobs();
    } catch (error) {
      console.error(error);
      toast.error('Unable to create repair job.');
    }
  };

  const handleUpdateJob = async () => {
    if (!selectedJob) return;

    try {
      await putRequest('repair_jobs.php', {
        id: selectedJob.id,
        customerCode: formData.customerCode,
        customerName: formData.customerName,
        model: formData.model,
        problem: formData.problem,
        estimatedCost: formData.estimatedCost,
        status: formData.status,
      });
      toast.success('Repair job updated successfully.');
      setShowModal(false);
      setSelectedJob(null);
      resetForm();
      loadJobs();
    } catch (error) {
      console.error(error);
      toast.error('Unable to update repair job.');
    }
  };

  const handleDeleteJob = async () => {
    if (!selectedJob) return;

    try {
      await deleteRequest('repair_jobs.php', { id: selectedJob.id });
      toast.success('Repair job deleted successfully.');
      setShowDeleteConfirm(false);
      setSelectedJob(null);
      loadJobs();
    } catch (error) {
      console.error(error);
      toast.error('Unable to delete repair job.');
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Repair Jobs</h1>
        <p className="text-gray-600 mt-1">Manage motorcycle repair jobs.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by job number, customer, or model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as RepairStatus | 'All')}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-6 py-3 bg-[#1e3a8a] text-white rounded-lg hover:bg-[#1e40af] transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Job
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job ID</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Code</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Problem</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredJobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{job.jobNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{job.customerCode}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{job.customerName}</td>
                  <td className="px-6 py-4 text-gray-700">{job.model}</td>
                  <td className="px-6 py-4 text-gray-700 max-w-xs truncate">{job.problem}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={job.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{new Date(job.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(job)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedJob(job);
                          setShowDeleteConfirm(true);
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {isLoading && (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading repair jobs...</p>
            </div>
          )}

          {!isLoading && filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No repair jobs found.</p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedJob ? 'Edit Repair Job' : 'Create Repair Job'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedJob(null);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer Code</label>
                  <input
                    type="text"
                    value={formData.customerCode}
                    onChange={(e) => setFormData({ ...formData, customerCode: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                    placeholder="C-001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                    placeholder="John Smith"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Motorcycle Model</label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                  placeholder="Honda CBR 600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Problem Description</label>
                <textarea
                  value={formData.problem}
                  onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                  placeholder="Describe the issue..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Cost</label>
                  <input
                    type="text"
                    value={formData.estimatedCost}
                    onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                    placeholder="₱150"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as RepairStatus })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedJob(null);
                  resetForm();
                }}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={selectedJob ? handleUpdateJob : handleCreateJob}
                className="px-6 py-3 bg-[#1e3a8a] text-white rounded-lg hover:bg-[#1e40af] transition-colors"
              >
                {selectedJob ? 'Update Job' : 'Create Job'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Repair Job</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete repair job <strong>{selectedJob.jobNumber}</strong>? This action cannot be undone.
              </p>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setSelectedJob(null);
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteJob}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
