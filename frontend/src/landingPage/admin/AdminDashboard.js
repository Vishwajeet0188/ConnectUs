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
      {/* <aside style={styles.sidebar}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>📊</div>
          <h2 style={styles.logoText}>AdminHub</h2>
        </div>
        <nav style={styles.navMenu}>
          <a href="#" style={{...styles.navItem, ...styles.navItemActive}} onClick={(e) => e.preventDefault()}>
            <span style={styles.navIcon}>📊</span>
            <span>Dashboard</span>
          </a>
          <a href="#" style={styles.navItem} onClick={(e) => e.preventDefault()}>
            <span style={styles.navIcon}>👥</span>
            <span>Users</span>
          </a>
          <a href="#" style={styles.navItem} onClick={(e) => e.preventDefault()}>
            <span style={styles.navIcon}>📈</span>
            <span>Analytics</span>
          </a>
          <a href="#" style={styles.navItem} onClick={(e) => e.preventDefault()}>
            <span style={styles.navIcon}>⚙️</span>
            <span>Settings</span>
          </a>
        </nav>
      </aside> */}

      {/* Main Content */}
      <main style={styles.mainContent}>
        {/* Header */}
        <header style={styles.header}>
          <div>
            <h1 style={styles.headerTitle}>Admin Dashboard</h1>
            <p style={styles.headerSubtitle}>Manage users and monitor system activity</p>
          </div>
          <div style={styles.headerRight}>
            <div style={styles.adminInfo}>
              <span style={styles.adminBadge}>Admin Panel</span>
              <span style={styles.adminEmail}>admin@example.com</span>
            </div>
            <button
              style={styles.logoutBtn}
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/login";
              }}
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Stats Cards */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>👥</div>
            <div style={styles.statInfo}>
              <h3 style={styles.statTitle}>Total Users</h3>
              <p style={styles.statNumber}>{totalUsers}</p>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'}}>👑</div>
            <div style={styles.statInfo}>
              <h3 style={styles.statTitle}>Total Admins</h3>
              <p style={styles.statNumber}>{totalAdmins}</p>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'}}>🎓</div>
            <div style={styles.statInfo}>
              <h3 style={styles.statTitle}>Students</h3>
              <p style={styles.statNumber}>{totalStudents}</p>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'}}>👪</div>
            <div style={styles.statInfo}>
              <h3 style={styles.statTitle}>Parents</h3>
              <p style={styles.statNumber}>{totalParents}</p>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'}}>💼</div>
            <div style={styles.statInfo}>
              <h3 style={styles.statTitle}>Professionals</h3>
              <p style={styles.statNumber}>{totalProfessionals}</p>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'}}>✅</div>
            <div style={styles.statInfo}>
              <h3 style={styles.statTitle}>Active Users</h3>
              <p style={styles.statNumber}>{activeUsers}</p>
            </div>
          </div>
        </div>

        {/* User Management Section */}
        <div style={styles.userManagement}>
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>User Management</h2>
              <p style={styles.sectionSubtitle}>Manage all users in the system</p>
            </div>
            <button style={styles.btnPrimary} onClick={() => setShowAddModal(true)}>
              <span>➕</span>
              <span>Add New User</span>
            </button>
          </div>

          {/* Filters */}
          <div style={styles.filters}>
            <div style={styles.searchBox}>
              <span style={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Search by name or email..."
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
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Full Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Join Date</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user._id} style={index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}>
                    <td style={styles.td}>
                      <span style={styles.userId}>#{user._id?.slice(-6) || 'N/A'}</span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.userName}>
                        <div style={styles.userAvatar}>
                          {user.fullName?.charAt(0) || 'U'}
                        </div>
                        <strong>{user.fullName || 'N/A'}</strong>
                      </div>
                    </td>
                    <td style={styles.td}>{user.email || 'N/A'}</td>
                    <td style={styles.td}>
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
                    <td style={styles.td}>
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
                    <td style={styles.td}>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td>
                    <td style={styles.td}>
                      <div style={styles.actions}>
                        <button
                          style={{...styles.actionBtn, ...styles.actionEdit}}
                          onClick={() => {
                            setSelectedUser(user);
                            setShowEditModal(true);
                          }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          style={{...styles.actionBtn, ...styles.actionDelete}}
                          onClick={() => deleteUser(user._id)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div style={styles.noData}>
                <div style={styles.noDataIcon}>📭</div>
                <p>{search || roleFilter !== "all"
                  ? "No users match your filters"
                  : "No users found"}</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add User Modal */}
      {showAddModal && (
        <div style={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Add New User</h2>
              <button style={styles.modalClose} onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name *</label>
              <input
                type="text"
                value={newUser.fullName}
                onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                placeholder="Enter full name"
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email *</label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="Enter email address"
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Password *</label>
              <input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                placeholder="Enter password"
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Role</label>
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
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Edit User</h2>
              <button style={styles.modalClose} onClick={() => setShowEditModal(false)}>✕</button>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                value={selectedUser.fullName}
                onChange={(e) => setSelectedUser({ ...selectedUser, fullName: e.target.value })}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                value={selectedUser.email}
                onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Role</label>
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

// Enhanced Inline styles
const styles = {
  // Container
  dashboardContainer: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
  },
  
  // Sidebar
  sidebar: {
    width: '280px',
    background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
    color: 'white',
    position: 'fixed',
    height: '100vh',
    overflowY: 'auto',
    boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)',
  },
  logo: {
    padding: '30px 24px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoIcon: {
    fontSize: '28px',
  },
  logoText: {
    fontSize: '22px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  navMenu: {
    padding: '20px 0',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 24px',
    color: '#a0aec0',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    fontWeight: '500',
    fontSize: '15px',
  },
  navIcon: {
    fontSize: '20px',
  },
  navItemActive: {
    background: 'linear-gradient(90deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
    color: 'white',
    borderLeft: '3px solid #667eea',
  },
  
  // Main Content
  mainContent: {
    flex: 1,
    marginLeft: 0,
    padding: '24px',
  },
  
  // Header
  header: {
    background: 'white',
    padding: '24px 32px',
    borderRadius: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  },
  headerTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1a1a2e',
    margin: '0 0 8px 0',
  },
  headerSubtitle: {
    fontSize: '14px',
    color: '#718096',
    margin: 0,
  },
  headerRight: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
  },
  adminInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '4px',
  },
  adminBadge: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '4px 12px',
    borderRadius: '12px',
    color: 'white',
    fontWeight: '600',
    fontSize: '12px',
  },
  adminEmail: {
    fontSize: '12px',
    color: '#718096',
  },
  logoutBtn: {
    background: '#ef4444',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '10px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    transition: 'all 0.3s ease',
  },
  
  // Stats Grid
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
    marginBottom: '32px',
  },
  statCard: {
    background: 'white',
    padding: '24px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  statIcon: {
    width: '60px',
    height: '60px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    color: 'white',
  },
  statInfo: {
    flex: 1,
  },
  statTitle: {
    fontSize: '14px',
    color: '#718096',
    margin: '0 0 8px 0',
    fontWeight: '500',
  },
  statNumber: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1a1a2e',
    margin: 0,
  },
  
  // User Management
  userManagement: {
    background: 'white',
    borderRadius: '16px',
    padding: '28px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '28px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  sectionTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#1a1a2e',
    margin: '0 0 8px 0',
  },
  sectionSubtitle: {
    fontSize: '14px',
    color: '#718096',
    margin: 0,
  },
  
  // Buttons
  btnPrimary: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '10px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    transition: 'transform 0.2s ease',
  },
  btnSecondary: {
    background: '#e2e8f0',
    color: '#475569',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.3s ease',
  },
  
  // Filters
  filters: {
    display: 'flex',
    gap: '16px',
    marginBottom: '28px',
    flexWrap: 'wrap',
  },
  searchBox: {
    flex: 1,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    fontSize: '16px',
  },
  searchInput: {
    padding: '12px 16px 12px 40px',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    width: '100%',
    fontSize: '14px',
    transition: 'border-color 0.3s ease',
  },
  select: {
    padding: '12px 16px',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    background: 'white',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'border-color 0.3s ease',
    minWidth: '150px',
  },
  
  // Table
  tableContainer: {
    overflowX: 'auto',
  },
  usersTable: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    background: '#f7fafc',
    borderBottom: '2px solid #e2e8f0',
  },
  th: {
    textAlign: 'left',
    padding: '16px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#4a5568',
  },
  td: {
    padding: '16px',
    fontSize: '14px',
    color: '#4a5568',
    borderBottom: '1px solid #e2e8f0',
  },
  tableRowEven: {
    background: 'white',
  },
  tableRowOdd: {
    background: '#fafafa',
  },
  userId: {
    fontFamily: 'monospace',
    fontSize: '12px',
    color: '#718096',
  },
  userName: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  userAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '600',
    fontSize: '14px',
  },
  roleBadge: {
    display: 'inline-block',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '12px',
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
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
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
    padding: '6px 14px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
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
    background: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    background: 'white',
    borderRadius: '20px',
    width: '90%',
    maxWidth: '500px',
    animation: 'slideIn 0.3s ease',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 28px',
    borderBottom: '1px solid #e2e8f0',
  },
  modalTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#1a1a2e',
    margin: 0,
  },
  modalClose: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#a0aec0',
    transition: 'color 0.3s ease',
  },
  formGroup: {
    marginBottom: '20px',
    padding: '0 28px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    fontSize: '14px',
    color: '#4a5568',
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '14px',
    transition: 'border-color 0.3s ease',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    padding: '20px 28px',
    borderTop: '1px solid #e2e8f0',
  },
  
  // Loading & Error
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    gap: '20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  loader: {
    width: '50px',
    height: '50px',
    border: '4px solid rgba(255, 255, 255, 0.3)',
    borderTopColor: 'white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  errorContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  errorBox: {
    background: 'white',
    padding: '48px',
    borderRadius: '20px',
    textAlign: 'center',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
  },
  retryButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '10px',
    cursor: 'pointer',
    marginTop: '20px',
    fontWeight: '600',
  },
  noData: {
    textAlign: 'center',
    padding: '60px',
    color: '#a0aec0',
  },
  noDataIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
};

// Add keyframe animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  
  @keyframes slideIn {
    from {
      transform: translateY(-30px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  input:hover, select:hover {
    border-color: #667eea;
  }
  
  input:focus, select:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  .stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
`;
document.head.appendChild(styleSheet);

export default AdminDashboard;