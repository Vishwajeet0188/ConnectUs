// AdminDashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";
const API = process.env.REACT_APP_API_URL;

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({
    fullName: "",
    email: "",
    role: "student",
    password: "",
  });

  // Fetch users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      console.log("Fetching users with token:", token ? "Token exists" : "No token");
      
      if (!token) {
        console.warn("No token found, trying anyway...");
        }

      const response = await axios.get(`${API}/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("API Response:", response.data);

      // Handle different response structures
      let usersData = [];
      if (response.data && response.data.users) {
        usersData = response.data.users;
      } else if (Array.isArray(response.data)) {
        usersData = response.data;
      } else if (response.data && response.data.data) {
        usersData = response.data.data;
      } else {
        usersData = [];
      }

      setUsers(usersData);
      setError("");
    } catch (err) {
      console.error("Error fetching users:", err);
      if (err.response) {
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);
        if (err.response.status === 401) {
          setError("Authentication failed. Please login again.");
          localStorage.removeItem("token");
        } else {
          setError(err.response.data?.message || "Failed to fetch users");
        }
      } else if (err.request) {
        setError(`Cannot connect to server. Please check if backend is running at ${API}`);
      } else {
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchSearch = 
      (user.fullName && user.fullName.toLowerCase().includes(search.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(search.toLowerCase()));

    const matchRole = roleFilter === "all" || user.role === roleFilter;

    return matchSearch && matchRole;
  });

  // Stats
  const totalUsers = users.length;
  const totalAdmins = users.filter((u) => u.role === "admin").length;
  const totalStudents = users.filter((u) => u.role === "student").length;
  const totalParents = users.filter((u) => u.role === "parent").length;
  const totalProfessionals = users.filter((u) => u.role === "professional").length;
  const activeUsers = users.filter((u) => u.status !== "inactive").length;

  // Add user
  const addUser = async () => {
    if (!newUser.fullName || !newUser.email || !newUser.password) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      
        const response = await axios.post(
        `${API}/admin/users`,
        {
          fullName: newUser.fullName,
          email: newUser.email,
          role: newUser.role,
          password: newUser.password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const addedUser = response.data.user || response.data;
      setUsers([...users, addedUser]);
      setShowAddModal(false);
      setNewUser({
        fullName: "",
        email: "",
        role: "student",
        password: "",
      });
      alert("User added successfully!");
    } catch (err) {
      console.error("Error adding user:", err);
      const errorMsg = err.response?.data?.message || "Failed to add user";
      alert(errorMsg);
    }
  };

  // Update user
  const updateUser = async () => {
    if (!selectedUser) return;

    try {
      const token = localStorage.getItem("token");
      
      const response = await axios.put(
          `${API}/admin/users/${selectedUser._id}`,
        {
          fullName: selectedUser.fullName,
          email: selectedUser.email,
          role: selectedUser.role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const updatedUser = response.data.user || response.data;
      setUsers(
        users.map((user) =>
          user._id === selectedUser._id ? updatedUser : user
        )
      );
      setShowEditModal(false);
      setSelectedUser(null);
      alert("User updated successfully!");
    } catch (err) {
      console.error("Error updating user:", err);
      const errorMsg = err.response?.data?.message || "Failed to update user";
      alert(errorMsg);
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/admin/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(users.filter((user) => user._id !== id));
      alert("User deleted successfully!");
    } catch (err) {
      console.error("Error deleting user:", err);
      const errorMsg = err.response?.data?.message || "Failed to delete user";
      alert(errorMsg);
    }
  };

  // Toggle user status
  const toggleUserStatus = async (user) => {
    const newStatus = user.status === "active" ? "inactive" : "active";

    try {
      const token = localStorage.getItem("token");
      
      await axios.patch(
         `${API}/admin/users/${user._id}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setUsers(
        users.map((u) =>
          u._id === user._id ? { ...u, status: newStatus } : u
        )
      );
    } catch (err) {
      console.error("Error toggling status:", err);
      const errorMsg = err.response?.data?.message || "Failed to update user status";
      alert(errorMsg);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorBox}>
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={fetchUsers} style={styles.retryButton}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.dashboardContainer}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.logo}>
          <h2>AdminHub</h2>
        </div>
        <nav style={styles.navMenu}>
          <a href="#" style={{...styles.navItem, ...styles.navItemActive}} onClick={(e) => e.preventDefault()}>
            📊 Dashboard
          </a>
          <a href="#" style={styles.navItem} onClick={(e) => e.preventDefault()}>
            👥 Users
          </a>
          <a href="#" style={styles.navItem} onClick={(e) => e.preventDefault()}>
            📈 Analytics
          </a>
          <a href="#" style={styles.navItem} onClick={(e) => e.preventDefault()}>
            ⚙️ Settings
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={styles.mainContent}>
        {/* Header */}
        <header style={styles.header}>
          <h1>Admin Dashboard</h1>
          <div style={styles.headerRight}>
            <span style={styles.adminBadge}>Admin Panel</span>
            <button
              style={styles.logoutBtn}
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/login";
              }}
            >
              Logout
            </button>
          </div>
        </header>

        {/* Stats Cards */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>👥</div>
            <div style={styles.statInfo}>
              <h3>Total Users</h3>
              <p style={styles.statNumber}>{totalUsers}</p>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>👑</div>
            <div style={styles.statInfo}>
              <h3>Total Admins</h3>
              <p style={styles.statNumber}>{totalAdmins}</p>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>🎓</div>
            <div style={styles.statInfo}>
              <h3>Students</h3>
              <p style={styles.statNumber}>{totalStudents}</p>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>👪</div>
            <div style={styles.statInfo}>
              <h3>Parents</h3>
              <p style={styles.statNumber}>{totalParents}</p>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>💼</div>
            <div style={styles.statInfo}>
              <h3>Professionals</h3>
              <p style={styles.statNumber}>{totalProfessionals}</p>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>✅</div>
            <div style={styles.statInfo}>
              <h3>Active Users</h3>
              <p style={styles.statNumber}>{activeUsers}</p>
            </div>
          </div>
        </div>

        {/* User Management Section */}
        <div style={styles.userManagement}>
          <div style={styles.sectionHeader}>
            <h2>User Management</h2>
            <button style={styles.btnPrimary} onClick={() => setShowAddModal(true)}>
              + Add New User
            </button>
          </div>

          {/* Filters */}
          <div style={styles.filters}>
            <div style={styles.searchBox}>
              <input
                type="text"
                placeholder="🔍 Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={styles.searchInput}
              />
            </div>
            <select 
              value={roleFilter} 
              onChange={(e) => setRoleFilter(e.target.value)}
              style={styles.select}
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="student">Student</option>
              <option value="parent">Parent</option>
              <option value="professional">Professional</option>
            </select>
          </div>

          {/* Users Table */}
          <div style={styles.tableContainer}>
            <table style={styles.usersTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Join Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>{user._id?.slice(0, 8) || 'N/A'}...</td>
                    <td><strong>{user.fullName || 'N/A'}</strong></td>
                    <td>{user.email || 'N/A'}</td>
                    <td>
                      <span style={{
                        ...styles.roleBadge,
                        ...(user.role === 'admin' ? styles.roleAdmin : 
                           user.role === 'student' ? styles.roleStudent :
                           user.role === 'parent' ? styles.roleParent : 
                           styles.roleProfessional)
                      }}>
                        {user.role || 'student'}
                      </span>
                    </td>
                    <td>
                      <button
                        style={{
                          ...styles.statusToggle,
                          ...(user.status === "active" ? styles.statusActive : styles.statusInactive)
                        }}
                        onClick={() => toggleUserStatus(user)}
                      >
                        {user.status || "active"}
                      </button>
                    </td>
                    <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td>
                    <td style={styles.actions}>
                      <button
                        style={{...styles.actionBtn, ...styles.actionEdit}}
                        onClick={() => {
                          setSelectedUser(user);
                          setShowEditModal(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        style={{...styles.actionBtn, ...styles.actionDelete}}
                        onClick={() => deleteUser(user._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div style={styles.noData}>
                {search || roleFilter !== "all"
                  ? "No users match your filters"
                  : "No users found"}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add User Modal */}
      {showAddModal && (
        <div style={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>Add New User</h2>
            <div style={styles.formGroup}>
              <label>Full Name *</label>
              <input
                type="text"
                value={newUser.fullName}
                onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                placeholder="Enter full name"
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label>Email *</label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="Enter email address"
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label>Password *</label>
              <input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                placeholder="Enter password"
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label>Role</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                style={styles.select}
              >
                <option value="student">Student</option>
                <option value="parent">Parent</option>
                <option value="professional">Professional</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div style={styles.modalActions}>
              <button style={styles.btnSecondary} onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button style={styles.btnPrimary} onClick={addUser}>
                Add User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div style={styles.modalOverlay} onClick={() => setShowEditModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>Edit User</h2>
            <div style={styles.formGroup}>
              <label>Full Name</label>
              <input
                type="text"
                value={selectedUser.fullName}
                onChange={(e) => setSelectedUser({ ...selectedUser, fullName: e.target.value })}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label>Email</label>
              <input
                type="email"
                value={selectedUser.email}
                onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label>Role</label>
              <select
                value={selectedUser.role}
                onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                style={styles.select}
              >
                <option value="student">Student</option>
                <option value="parent">Parent</option>
                <option value="professional">Professional</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div style={styles.modalActions}>
              <button style={styles.btnSecondary} onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
              <button style={styles.btnPrimary} onClick={updateUser}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Inline styles (no external CSS file needed)
const styles = {
  // Container
  dashboardContainer: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f5f6fa',
  },
  
  // Sidebar
  sidebar: {
    width: '260px',
    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    color: 'white',
    position: 'fixed',
    height: '100vh',
    overflowY: 'auto',
  },
  logo: {
    padding: '24px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  navMenu: {
    padding: '20px 0',
  },
  navItem: {
    display: 'block',
    padding: '12px 24px',
    color: '#cbd5e1',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    fontWeight: '500',
  },
  navItemActive: {
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    borderLeft: '3px solid #60a5fa',
  },
  
  // Main Content
  mainContent: {
    flex: 1,
    marginLeft: '260px',
    padding: '20px',
  },
  
  // Header
  header: {
    background: 'white',
    padding: '20px 30px',
    borderRadius: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  headerRight: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
  },
  adminBadge: {
    background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
    padding: '8px 16px',
    borderRadius: '20px',
    color: 'white',
    fontWeight: '600',
    fontSize: '0.875rem',
  },
  logoutBtn: {
    background: '#ef4444',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  
  // Stats Grid
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  statCard: {
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  statIcon: {
    fontSize: '2rem',
  },
  statInfo: {
    flex: 1,
  },
  statNumber: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
  },
  
  // User Management
  userManagement: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  
  // Buttons
  btnPrimary: {
    background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  btnSecondary: {
    background: '#e2e8f0',
    color: '#475569',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  
  // Filters
  filters: {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  searchBox: {
    flex: 1,
  },
  searchInput: {
    padding: '10px 16px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    width: '100%',
    fontSize: '0.875rem',
  },
  select: {
    padding: '10px 16px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    background: 'white',
    fontSize: '0.875rem',
    cursor: 'pointer',
  },
  
  // Table
  tableContainer: {
    overflowX: 'auto',
  },
  usersTable: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  roleBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  roleAdmin: {
    background: '#fef3c7',
    color: '#d97706',
  },
  roleStudent: {
    background: '#d1fae5',
    color: '#059669',
  },
  roleParent: {
    background: '#e0e7ff',
    color: '#4f46e5',
  },
  roleProfessional: {
    background: '#fce7f3',
    color: '#db2777',
  },
  statusToggle: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
  },
  statusActive: {
    background: '#d1fae5',
    color: '#059669',
  },
  statusInactive: {
    background: '#fee2e2',
    color: '#dc2626',
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
  actionBtn: {
    padding: '4px 12px',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
  },
  actionEdit: {
    background: '#e0e7ff',
    color: '#4f46e5',
  },
  actionDelete: {
    background: '#fee2e2',
    color: '#dc2626',
  },
  
  // Modal
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    background: 'white',
    borderRadius: '16px',
    padding: '32px',
    width: '90%',
    maxWidth: '500px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '0.875rem',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '24px',
  },
  
  // Loading & Error
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    gap: '20px',
  },
  loader: {
    width: '50px',
    height: '50px',
    border: '4px solid #e2e8f0',
    borderTopColor: '#60a5fa',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  errorContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  errorBox: {
    background: 'white',
    padding: '40px',
    borderRadius: '12px',
    textAlign: 'center',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  retryButton: {
    background: '#60a5fa',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '16px',
  },
  noData: {
    textAlign: 'center',
    padding: '48px',
    color: '#94a3b8',
  },
};

// Add keyframe animation for loader
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
document.head.appendChild(styleSheet);

export default AdminDashboard;