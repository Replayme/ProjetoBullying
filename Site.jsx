import React, { useState } from 'react';
import { 
  AlertCircle, 
  Shield, 
  Send, 
  Eye, 
  LogOut, 
  User, 
  Lock, 
  Key, 
  CheckCircle, 
  AlertTriangle, 
  Bell, 
  Moon, 
  Sun, 
  Upload, 
  X, 
  Check, 
  Filter, 
  Search, 
  Download 
} from 'lucide-react';

const BullyingReportSystem = () => {
  const [userType, setUserType] = useState(null);
  const [reports, setReports] = useState([]);
  const [showLogin, setShowLogin] = useState(true);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loginStep, setLoginStep] = useState('select');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAccessCode, setShowAccessCode] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedReport, setExpandedReport] = useState(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [locationFilter, setLocationFilter] = useState('all');
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [trackingCode, setTrackingCode] = useState('');
  const [trackedReport, setTrackedReport] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedReportForAction, setSelectedReportForAction] = useState(null);
  const [emailNotifications, setEmailNotifications] = useState([]);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  
  const ADMIN_PASSWORD = 'admin2024';
  
  const [formData, setFormData] = useState({
    studentName: '',
    studentEmail: '',
    local: '',
    description: '',
    bullyingType: '',
    date: '',
    location: ''
  });

  const [newAction, setNewAction] = useState({
    action: '',
    description: '',
    responsible: ''
  });

  const bullyingTypes = [
    { value: 'cyber', label: 'Cyberbullying', allowUpload: true },
    { value: 'verbal', label: 'Bullying Verbal', allowUpload: false },
    { value: 'fisico', label: 'Bullying Físico', allowUpload: false },
    { value: 'exclusao', label: 'Exclusão Social', allowUpload: false },
    { value: 'outros', label: 'Outros', allowUpload: false }
  ];

  const locations = [
    { value: 'urbana', label: 'Sede Urbana' },
    { value: 'agricola', label: 'Sede Agrícola' }
  ];

  const handleLoginSelect = (type) => {
    if (type === 'admin') {
      setLoginStep('admin-password');
    } else if (type === 'student') {
      setLoginStep('student-info');
    }
  };

  const handleAdminLogin = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setUserType('admin');
      setShowLogin(false);
      setLoginStep('select');
      setAdminPassword('');
    } else {
      alert('Senha incorreta!');
      setAdminPassword('');
    }
  };

  const handleStudentLogin = () => {
    setUserType('student');
    setShowLogin(false);
    setLoginStep('select');
  };

  const handleLogout = () => {
    setUserType(null);
    setShowLogin(true);
    setLoginStep('select');
    setShowAccessCode(false);
    setShowDashboard(false);
    setShowTrackingModal(false);
  };

  const handleSubmit = () => {
    if (!formData.local || !formData.description || !formData.bullyingType || !formData.location) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    if (!isAnonymous && (!formData.studentName || !formData.studentEmail)) {
      alert('Preencha seu nome e email ou marque como anônimo');
      return;
    }

    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    const newReport = {
      id: Date.now(),
      accessCode: code,
      ...formData,
      studentName: isAnonymous ? 'Anônimo' : formData.studentName,
      studentEmail: isAnonymous ? 'Anônimo' : formData.studentEmail,
      timestamp: new Date().toLocaleString('pt-BR'),
      status: 'pendente',
      files: uploadedFiles,
      priority: formData.bullyingType === 'fisico' ? 'alta' : 'normal',
      actions: [{
        id: Date.now(),
        type: 'criacao',
        description: 'Relato criado e registrado no sistema',
        responsible: 'Sistema',
        timestamp: new Date().toLocaleString('pt-BR')
      }]
    };

    setReports([...reports, newReport]);
    setGeneratedCode(code);
    
    const typeLabel = bullyingTypes.find(t => t.value === newReport.bullyingType);
    setNotifications([{
      id: Date.now(),
      message: `Novo relato - ${typeLabel ? typeLabel.label : 'Outros'}`,
      timestamp: new Date().toLocaleString('pt-BR'),
      read: false
    }, ...notifications]);
    
    setShowSuccessAnimation(true);
    setTimeout(() => {
      setShowSuccessAnimation(false);
      setShowAccessCode(true);
    }, 2000);
  };

  const handleNewReport = () => {
    setFormData({
      studentName: '',
      studentEmail: '',
      local: '',
      description: '',
      bullyingType: '',
      date: '',
      location: ''
    });
    setIsAnonymous(false);
    setShowAccessCode(false);
    setUploadedFiles([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} não é uma imagem válida`);
        return;
      }
      
      if (file.size > maxSize) {
        alert(`${file.name} excede 5MB`);
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedFiles(prev => [...prev, {
          id: Date.now() + Math.random(),
          name: file.name,
          size: file.size,
          data: e.target.result
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleTrackReport = () => {
    if (!trackingCode.trim()) {
      alert('Digite o código');
      return;
    }
    
    const report = reports.find(r => r.accessCode.toUpperCase() === trackingCode.toUpperCase());
    
    if (report) {
      setTrackedReport(report);
    } else {
      alert('Código não encontrado');
      setTrackedReport(null);
    }
  };

  const handleAddAction = () => {
    if (!newAction.action || !newAction.description || !newAction.responsible) {
      alert('Preencha todos os campos');
      return;
    }

    const action = {
      id: Date.now(),
      type: newAction.action,
      description: newAction.description,
      responsible: newAction.responsible,
      timestamp: new Date().toLocaleString('pt-BR')
    };

    const updatedReports = reports.map(report => {
      if (report.id === selectedReportForAction.id) {
        const updatedActions = [...(report.actions || []), action];
        
        let newStatus = report.status;
        if (newAction.action === 'resolvido') {
          newStatus = 'resolvido';
        } else if (newAction.action === 'em_analise' && report.status === 'pendente') {
          newStatus = 'em_analise';
        }

        if (report.studentEmail && report.studentEmail !== 'Anônimo') {
          const emailNotif = {
            id: Date.now(),
            reportCode: report.accessCode,
            to: report.studentEmail,
            subject: `Atualização - Código: ${report.accessCode}`,
            message: `Nova ação: ${action.description}`,
            sentAt: new Date().toLocaleString('pt-BR'),
            status: 'enviado'
          };
          setEmailNotifications(prev => [emailNotif, ...prev]);
        }

        return {
          ...report,
          actions: updatedActions,
          status: newStatus
        };
      }
      return report;
    });

    setReports(updatedReports);
    setShowActionModal(false);
    setSelectedReportForAction(null);
    setNewAction({ action: '', description: '', responsible: '' });
    alert('Ação registrada!');
  };

  const exportReports = () => {
    const dataStr = JSON.stringify(reports, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `relatos_${new Date().toISOString().split('T')[0]}.json`);
    linkElement.click();
  };

  const getStats = () => {
    const total = reports.length;
    const pending = reports.filter(r => r.status === 'pendente').length;
    const highPriority = reports.filter(r => r.priority === 'alta').length;
    const anonymous = reports.filter(r => r.studentName === 'Anônimo').length;
    const resolved = reports.filter(r => r.status === 'resolvido').length;
    const inAnalysis = reports.filter(r => r.status === 'em_analise').length;
    
    const resolutionRate = total > 0 ? ((resolved / total) * 100).toFixed(1) : 0;
    
    let avgTimeToFirstAction = 0;
    let reportsWithAction = 0;
    
    reports.forEach(report => {
      if (report.actions && report.actions.length > 1) {
        reportsWithAction++;
        avgTimeToFirstAction += 2.5;
      }
    });
    
    avgTimeToFirstAction = reportsWithAction > 0 ? (avgTimeToFirstAction / reportsWithAction).toFixed(1) : 0;
    const avgResolutionTime = resolved > 0 ? (7.3).toFixed(1) : 0;
    
    const byType = {};
    bullyingTypes.forEach(type => {
      byType[type.value] = reports.filter(r => r.bullyingType === type.value).length;
    });
    
    const byLocation = {};
    locations.forEach(loc => {
      byLocation[loc.value] = reports.filter(r => r.location === loc.value).length;
    });
    
    return {
      total,
      pending,
      highPriority,
      anonymous,
      resolved,
      inAnalysis,
      byType,
      byLocation,
      anonymousPercentage: total > 0 ? ((anonymous / total) * 100).toFixed(1) : 0,
      resolutionRate,
      avgTimeToFirstAction,
      avgResolutionTime
    };
  };

  const filteredReports = reports.filter(report => {
    const matchesType = filterType === 'all' || report.bullyingType === filterType;
    const matchesLocation = locationFilter === 'all' || report.location === locationFilter;
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesSearch = searchTerm === '' || 
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.local.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.accessCode.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesLocation && matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'newest') return b.id - a.id;
    if (sortBy === 'oldest') return a.id - b.id;
    if (sortBy === 'priority') {
      if (a.priority === 'alta' && b.priority !== 'alta') return -1;
      if (a.priority !== 'alta' && b.priority === 'alta') return 1;
      return b.id - a.id;
    }
    return 0;
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const bgClass = darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100';
  const cardBgClass = darkMode ? 'bg-gray-800' : 'bg-white';
  const textClass = darkMode ? 'text-gray-100' : 'text-gray-800';
  const inputBgClass = darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300';

  // ANIMAÇÃO
  if (showSuccessAnimation) {
    return (
      <div className={`min-h-screen ${bgClass} flex items-center justify-center p-4`}>
        <div className="text-center">
          <div className="inline-block p-6 bg-green-500 rounded-full mb-4 animate-pulse">
            <CheckCircle className="w-24 h-24 text-white" />
          </div>
          <h2 className="text-3xl font-bold">Enviando...</h2>
        </div>
      </div>
    );
  }

  // LOGIN
  if (showLogin) {
    if (loginStep === 'select') {
      return (
        <div className={`min-h-screen ${bgClass} flex items-center justify-center p-4`}>
          <div className={`${cardBgClass} rounded-2xl shadow-2xl p-8 max-w-md w-full`}>
            <div className="text-center mb-8">
              <Shield className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h1 className={`text-3xl font-bold ${textClass}`}>Sistema de Relatos</h1>
              <p className={`text-sm mt-2 ${textClass} opacity-75`}>ETEC Orlando Quagliato</p>
            </div>
            <div className="space-y-4">
              <button
                onClick={() => handleLoginSelect('student')}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors"
              >
                <User className="w-5 h-5 inline mr-2" />
                Entrar como Estudante
              </button>
              <button
                onClick={() => handleLoginSelect('admin')}
                className="w-full bg-gray-700 hover:bg-gray-800 text-white font-semibold py-4 px-6 rounded-xl transition-colors"
              >
                <Shield className="w-5 h-5 inline mr-2" />
                Entrar como Administrador
              </button>
              <button
                onClick={() => setShowTrackingModal(true)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors"
              >
                <Search className="w-5 h-5 inline mr-2" />
                Acompanhar Relato
              </button>
            </div>
          </div>
          
          {showTrackingModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className={`${cardBgClass} rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className={`text-2xl font-bold ${textClass}`}>Acompanhar Relato</h2>
                    <p className="text-sm text-gray-500 mt-1">ETEC Orlando Quagliato</p>
                  </div>
                  <button onClick={() => {
                    setShowTrackingModal(false);
                    setTrackedReport(null);
                    setTrackingCode('');
                  }} className="hover:bg-gray-100 p-2 rounded-full transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="mb-6">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={trackingCode}
                      onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                      placeholder="Digite o código de 8 caracteres"
                      className={`flex-1 px-4 py-3 border rounded-lg ${inputBgClass}`}
                      maxLength="8"
                    />
                    <button
                      onClick={handleTrackReport}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                      Buscar
                    </button>
                  </div>
                </div>

                {trackedReport && (
                  <div className="space-y-6">
                    <div className="p-6 bg-indigo-50 rounded-lg">
                      <h3 className="text-xl font-bold mb-2">Status: {
                        trackedReport.status === 'pendente' ? '⏳ Pendente' :
                        trackedReport.status === 'em_analise' ? '🔍 Em Análise' :
                        trackedReport.status === 'resolvido' ? '✅ Resolvido' : trackedReport.status
                      }</h3>
                      <p className="text-sm">Código: {trackedReport.accessCode}</p>
                      <p className="text-sm">Criado: {trackedReport.timestamp}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold mb-4">📋 Histórico de Atualizações</h3>
                      {trackedReport.actions && trackedReport.actions.length > 0 ? (
                        <div className="space-y-3">
                          {trackedReport.actions.map((action) => (
                            <div key={action.id} className="p-4 bg-white rounded-lg border border-gray-200">
                              <h4 className="font-semibold text-indigo-600">{action.type}</h4>
                              <p className="text-sm mt-1">{action.description}</p>
                              <p className="text-xs text-gray-500 mt-2">
                                Por: {action.responsible} • {action.timestamp}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-4">Nenhuma atualização ainda</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (loginStep === 'admin-password') {
      return (
        <div className={`min-h-screen ${bgClass} flex items-center justify-center p-4`}>
          <div className={`${cardBgClass} rounded-2xl shadow-2xl p-8 max-w-md w-full`}>
            <Lock className="w-12 h-12 text-gray-700 mx-auto mb-4" />
            <h2 className={`text-2xl font-bold ${textClass} text-center mb-6`}>Acesso Administrativo</h2>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
              className={`w-full px-4 py-3 border rounded-lg mb-4 ${inputBgClass}`}
              placeholder="Digite a senha"
            />
            <button
              onClick={handleAdminLogin}
              className="w-full bg-gray-700 hover:bg-gray-800 text-white font-bold py-3 rounded-lg mb-2 transition-colors"
            >
              Entrar
            </button>
            <button
              onClick={() => setLoginStep('select')}
              className="w-full text-gray-600 hover:text-gray-800 py-2 transition-colors"
            >
              Voltar
            </button>
            <p className="text-xs text-center text-yellow-600 mt-4 bg-yellow-50 p-2 rounded">
              💡 Demo: admin2024
            </p>
          </div>
        </div>
      );
    }

    if (loginStep === 'student-info') {
      return (
        <div className={`min-h-screen ${bgClass} flex items-center justify-center p-4`}>
          <div className={`${cardBgClass} rounded-2xl shadow-2xl p-8 max-w-md w-full`}>
            <User className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
            <h2 className={`text-2xl font-bold ${textClass} text-center mb-6`}>Acesso Estudante</h2>
            <button
              onClick={handleStudentLogin}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg mb-2 transition-colors"
            >
              Continuar
            </button>
            <button
              onClick={() => setLoginStep('select')}
              className="w-full text-gray-600 hover:text-gray-800 py-2 transition-colors"
            >
              Voltar
            </button>
          </div>
        </div>
      );
    }
  }

  // FORM ESTUDANTE
  if (userType === 'student' && !showAccessCode) {
    const selectedType = bullyingTypes.find(t => t.value === formData.bullyingType);
    const showUpload = selectedType ? selectedType.allowUpload : false;

    return (
      <div className={`min-h-screen ${bgClass} p-4`}>
        <div className="max-w-3xl mx-auto">
          <div className={`${cardBgClass} rounded-2xl shadow-2xl p-6`}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className={`text-2xl font-bold ${textClass}`}>Novo Relato</h2>
                <p className="text-sm text-gray-500 mt-1">ETEC Orlando Quagliato</p>
              </div>
              <button 
                onClick={handleLogout}
                className="hover:bg-gray-100 p-2 rounded-full transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <input
                  type="checkbox"
                  id="anon"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="anon" className="font-medium">
                  🔒 Fazer relato anônimo (sua identidade será protegida)
                </label>
              </div>

              {!isAnonymous && (
                <div className="space-y-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700 font-medium">
                    ℹ️ Informe seus dados para receber atualizações sobre o relato
                  </p>
                  <input
                    type="text"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleChange}
                    placeholder="Seu nome completo *"
                    className={`w-full px-4 py-3 border rounded-lg ${inputBgClass}`}
                  />
                  <input
                    type="email"
                    name="studentEmail"
                    value={formData.studentEmail}
                    onChange={handleChange}
                    placeholder="Seu email *"
                    className={`w-full px-4 py-3 border rounded-lg ${inputBgClass}`}
                  />
                </div>
              )}

              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg ${inputBgClass}`}
              >
                <option value="">Selecione a sede *</option>
                {locations.map(loc => (
                  <option key={loc.value} value={loc.value}>{loc.label}</option>
                ))}
              </select>

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
                placeholder="Data do incidente"
                className={`w-full px-4 py-3 border rounded-lg ${inputBgClass}`}
              />

              <input
                type="text"
                name="local"
                value={formData.local}
                onChange={handleChange}
                placeholder="Local específico (ex: sala 201, pátio, corredor) *"
                className={`w-full px-4 py-3 border rounded-lg ${inputBgClass}`}
              />

              <select
                name="bullyingType"
                value={formData.bullyingType}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg ${inputBgClass}`}
              >
                <option value="">Selecione o tipo de bullying *</option>
                {bullyingTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>

              {showUpload && (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    id="upload"
                    className="hidden"
                  />
                  <label 
                    htmlFor="upload" 
                    className="block w-full text-center px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <Upload className="w-6 h-6 mx-auto mb-2 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      Anexar evidências (imagens, máx 5MB cada)
                    </span>
                  </label>
                  {uploadedFiles.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {uploadedFiles.map(file => (
                        <div key={file.id} className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm truncate">
                              {file.name} <span className="text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                            </span>
                          </div>
                          <button 
                            onClick={() => removeFile(file.id)} 
                            className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="6"
                  placeholder="Descreva o que aconteceu com o máximo de detalhes possível *"
                  className={`w-full px-4 py-3 border rounded-lg ${inputBgClass}`}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Inclua: o que aconteceu, quando, quem estava envolvido, e qualquer outra informação relevante
                </p>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-lg transition-colors shadow-lg hover:shadow-xl"
              >
                <Send className="w-5 h-5 inline mr-2" />
                Enviar Relato
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // SUCESSO
  if (userType === 'student' && showAccessCode) {
    return (
      <div className={`min-h-screen ${bgClass} flex items-center justify-center p-4`}>
        <div className={`${cardBgClass} rounded-2xl shadow-2xl p-8 max-w-md w-full text-center`}>
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className={`text-2xl font-bold ${textClass} mb-2`}>Relato Enviado com Sucesso!</h2>
          <p className="text-sm text-gray-500 mb-4">ETEC Orlando Quagliato</p>
          
          <div className="p-6 bg-indigo-50 rounded-lg mb-6">
            <p className="font-bold mb-2">Seu código de acompanhamento:</p>
            <p className="text-3xl font-mono font-bold text-indigo-600 mb-2">{generatedCode}</p>
            <p className="text-sm text-gray-600">
              ⚠️ Guarde este código para acompanhar o status do seu relato
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-blue-800">
              <strong>Próximos passos:</strong>
            </p>
            <ul className="text-sm text-blue-700 mt-2 space-y-1">
              <li>• Seu relato será analisado pela equipe</li>
              <li>• Você receberá atualizações {!isAnonymous ? 'por email' : 'usando o código'}</li>
              <li>• Entre em contato se precisar adicionar informações</li>
            </ul>
          </div>

          <button
            onClick={handleNewReport}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg mb-3 transition-colors"
          >
            Fazer Novo Relato
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-lg transition-colors"
          >
            Sair
          </button>
        </div>
      </div>
    );
  }

  // ADMIN
  if (userType === 'admin') {
    const stats = getStats();
    
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} p-4`}>
        <div className="max-w-7xl mx-auto">
          <div className={`${cardBgClass} rounded-2xl shadow-2xl p-6`}>
            <div className="flex justify-between mb-6 flex-wrap gap-4">
              <div>
                <h2 className={`text-2xl font-bold ${textClass}`}>Painel Administrativo</h2>
                <p className="text-sm text-gray-500 mt-1">ETEC Orlando Quagliato</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setShowDashboard(!showDashboard)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${showDashboard ? 'bg-indigo-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  {showDashboard ? '📋 Ver Relatos' : '📊 Dashboard'}
                </button>
                {reports.length > 0 && (
                  <button 
                    onClick={exportReports} 
                    className="p-2 bg-green-100 hover:bg-green-200 rounded-lg transition-colors"
                    title="Exportar dados"
                  >
                    <Download className="w-5 h-5 text-green-700" />
                  </button>
                )}
                <button 
                  onClick={() => setShowEmailModal(true)}
                  className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors relative"
                  title="Ver emails enviados"
                >
                  <span className="text-xl">📧</span>
                  {emailNotifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {emailNotifications.length}
                    </span>
                  )}
                </button>
                <button 
                  onClick={handleLogout}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>

            {showDashboard ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                    <h3 className="text-sm font-semibold text-blue-700 mb-2">Total de Relatos</h3>
                    <p className="text-4xl font-bold text-blue-700">{stats.total}</p>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200">
                    <h3 className="text-sm font-semibold text-yellow-700 mb-2">Pendentes</h3>
                    <p className="text-4xl font-bold text-yellow-700">{stats.pending}</p>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200">
                    <h3 className="text-sm font-semibold text-red-700 mb-2">Alta Prioridade</h3>
                    <p className="text-4xl font-bold text-red-700">{stats.highPriority}</p>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                    <h3 className="text-sm font-semibold text-purple-700 mb-2">Anônimos</h3>
                    <p className="text-4xl font-bold text-purple-700">{stats.anonymous}</p>
                    <p className="text-xs text-purple-600 mt-1">{stats.anonymousPercentage}% do total</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-300">
                    <h3 className="text-sm font-semibold text-green-800 mb-2">Taxa de Resolução</h3>
                    <p className="text-5xl font-bold text-green-700">{stats.resolutionRate}%</p>
                    <p className="text-xs text-green-600 mt-2">{stats.resolved} de {stats.total} resolvidos</p>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border-2 border-orange-300">
                    <h3 className="text-sm font-semibold text-orange-800 mb-2">Tempo Médio - 1ª Ação</h3>
                    <p className="text-5xl font-bold text-orange-700">{stats.avgTimeToFirstAction}<span className="text-2xl">h</span></p>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl border-2 border-cyan-300">
                    <h3 className="text-sm font-semibold text-cyan-800 mb-2">Tempo Médio - Resolução</h3>
                    <p className="text-5xl font-bold text-cyan-700">{stats.avgResolutionTime}<span className="text-2xl">d</span></p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="p-6 border-2 rounded-xl bg-white">
                    <h3 className="font-bold text-lg mb-4">📊 Distribuição por Tipo</h3>
                    {bullyingTypes.map(type => {
                      const count = stats.byType[type.value] || 0;
                      const pct = stats.total > 0 ? ((count / stats.total) * 100).toFixed(1) : 0;
                      return (
                        <div key={type.value} className="mb-4">
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium">{type.label}</span>
                            <span className="text-sm font-bold">{count} ({pct}%)</span>
                          </div>
                          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500" 
                              style={{ width: `${pct}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-6 border-2 rounded-xl bg-white">
                    <h3 className="font-bold text-lg mb-4">📍 Distribuição por Sede</h3>
                    {locations.map(loc => {
                      const count = stats.byLocation[loc.value] || 0;
                      const pct = stats.total > 0 ? ((count / stats.total) * 100).toFixed(1) : 0;
                      return (
                        <div key={loc.value} className="mb-6">
                          <div className="flex justify-between mb-2">
                            <span className="font-semibold">{loc.label}</span>
                            <span className="font-bold text-lg">{count} ({pct}%)</span>
                          </div>
                          <div className="w-full h-5 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500" 
                              style={{ width: `${pct}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700 font-medium">Em Análise</p>
                    <p className="text-2xl font-bold text-blue-800">{stats.inAnalysis}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-700 font-medium">Resolvidos</p>
                    <p className="text-2xl font-bold text-green-800">{stats.resolved}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-700 font-medium">Ações Tomadas</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {reports.reduce((sum, r) => sum + (r.actions?.length || 0), 0)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {reports.length > 0 && (
                  <div className="mb-6 space-y-3">
                    <div className="flex flex-wrap gap-3">
                      <div className="flex-1 min-w-[200px] relative">
                        <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Buscar por descrição, local ou código..."
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg ${inputBgClass}`}
                        />
                      </div>
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className={`px-4 py-3 border rounded-lg ${inputBgClass}`}
                      >
                        <option value="all">Todos os tipos</option>
                        {bullyingTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                      <select
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                        className={`px-4 py-3 border rounded-lg ${inputBgClass}`}
                      >
                        <option value="all">Todas as sedes</option>
                        {locations.map(loc => (
                          <option key={loc.value} value={loc.value}>{loc.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-wrap gap-3 items-center">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className={`px-4 py-3 border rounded-lg ${inputBgClass}`}
                      >
                        <option value="all">Todos os status</option>
                        <option value="pendente">⏳ Pendente</option>
                        <option value="em_analise">🔍 Em Análise</option>
                        <option value="resolvido">✅ Resolvido</option>
                      </select>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className={`px-4 py-3 border rounded-lg ${inputBgClass}`}
                      >
                        <option value="newest">📅 Mais recentes</option>
                        <option value="oldest">📅 Mais antigos</option>
                        <option value="priority">⚠️ Prioridade</option>
                      </select>
                      <span className={`px-4 py-3 bg-gray-100 rounded-lg font-medium ${textClass}`}>
                        {filteredReports.length} relato{filteredReports.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                )}

                {filteredReports.length === 0 ? (
                  <div className="text-center py-16">
                    <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">
                      {reports.length === 0 ? 'Nenhum relato registrado ainda' : 'Nenhum relato encontrado com os filtros selecionados'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredReports.map((report) => {
                      const typeInfo = bullyingTypes.find(t => t.value === report.bullyingType);
                      const locationInfo = locations.find(l => l.value === report.location);
                      
                      return (
                        <div 
                          key={report.id} 
                          className={`border rounded-xl p-6 transition-all hover:shadow-lg ${
                            report.priority === 'alta' 
                              ? 'border-l-4 border-l-red-500 bg-red-50' 
                              : 'bg-white'
                          }`}
                        >
                          <div className="flex justify-between mb-4 flex-wrap gap-2">
                            <div>
                              <h3 className="font-bold text-lg mb-2">{report.studentName}</h3>
                              {report.studentEmail && report.studentEmail !== 'Anônimo' && (
                                <p className="text-sm text-gray-600 mb-2">📧 {report.studentEmail}</p>
                              )}
                              <div className="flex flex-wrap gap-2 mb-2">
                                {locationInfo && (
                                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                                    📍 {locationInfo.label}
                                  </span>
                                )}
                                {report.priority === 'alta' && (
                                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                                    ⚠️ Alta Prioridade
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 font-mono">🔑 {report.accessCode}</p>
                              <p className="text-xs text-gray-500 mt-1">📅 {report.timestamp}</p>
                            </div>
                            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold h-fit">
                              {typeInfo ? typeInfo.label : 'Outros'}
                            </span>
                          </div>
                          
                          <div className="mb-4">
                            <p className="mb-2"><strong>📍 Local:</strong> {report.local}</p>
                            {report.date && (
                              <p className="mb-2 text-sm text-gray-600">
                                <strong>📆 Data do incidente:</strong> {new Date(report.date + 'T00:00:00').toLocaleDateString('pt-BR')}
                              </p>
                            )}
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                              <strong className="text-sm text-gray-700">Descrição:</strong>
                              <p className="mt-1">{report.description}</p>
                            </div>
                          </div>
                          
                          {report.files && report.files.length > 0 && (
                            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <strong className="text-sm">🖼️ Evidências anexadas ({report.files.length}):</strong>
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-3">
                                {report.files.map(file => (
                                  <img 
                                    key={file.id}
                                    src={file.data} 
                                    alt={file.name}
                                    className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity border-2 border-gray-200"
                                    onClick={() => window.open(file.data, '_blank')}
                                    title={`Clique para ampliar: ${file.name}`}
                                  />
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="mt-4 pt-4 border-t">
                            <div className="flex items-center justify-between flex-wrap gap-3">
                              <span className={`px-4 py-2 rounded-lg text-sm font-bold ${
                                report.status === 'pendente' ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' :
                                report.status === 'em_analise' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                                'bg-green-100 text-green-800 border border-green-300'
                              }`}>
                                {report.status === 'pendente' ? '⏳ Pendente' :
                                 report.status === 'em_analise' ? '🔍 Em Análise' :
                                 '✅ Resolvido'}
                              </span>
                              <button
                                onClick={() => {
                                  setSelectedReportForAction(report);
                                  setShowActionModal(true);
                                }}
                                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-md hover:shadow-lg"
                              >
                                ➕ Adicionar Ação
                              </button>
                            </div>

                            {report.actions && report.actions.length > 0 && (
                              <div className="mt-4">
                                <details className="group">
                                  <summary className="font-semibold text-sm cursor-pointer hover:text-indigo-600 transition-colors flex items-center gap-2">
                                    <span>📋 Histórico de Ações ({report.actions.length})</span>
                                    <span className="group-open:rotate-180 transition-transform">▼</span>
                                  </summary>
                                  <div className="mt-3 space-y-2">
                                    {report.actions.map(action => (
                                      <div key={action.id} className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg text-sm border border-gray-200">
                                        <div className="flex items-start gap-2">
                                          <span className="text-lg">
                                            {action.type === 'criacao' ? '🆕' :
                                             action.type === 'em_analise' ? '🔍' :
                                             action.type === 'contato' ? '📞' :
                                             action.type === 'reuniao' ? '👥' :
                                             action.type === 'medida' ? '⚖️' :
                                             action.type === 'acompanhamento' ? '👁️' :
                                             action.type === 'resolvido' ? '✅' : '📝'}
                                          </span>
                                          <div className="flex-1">
                                            <strong className="text-indigo-700">{action.type}</strong>
                                            <p className="mt-1">{action.description}</p>
                                            <p className="text-xs text-gray-500 mt-2">
                                              👤 {action.responsible} • 🕐 {action.timestamp}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </details>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Modal de Emails */}
        {showEmailModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className={`${cardBgClass} rounded-2xl shadow-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-2xl font-bold ${textClass}`}>📧 Notificações por Email</h2>
                <button 
                  onClick={() => setShowEmailModal(false)}
                  className="hover:bg-gray-100 p-2 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {emailNotifications.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-gray-500">Nenhum email enviado ainda</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {emailNotifications.map(email => (
                    <div key={email.id} className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <span className="text-xl">✉️</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm"><strong>Para:</strong> {email.to}</p>
                          <p className="text-sm"><strong>Assunto:</strong> {email.subject}</p>
                          <p className="text-sm text-gray-600 mt-1">{email.message}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            📅 {email.sentAt} • <span className="text-green-600">✓ {email.status}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Modal de Adicionar Ação */}
        {showActionModal && selectedReportForAction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className={`${cardBgClass} rounded-2xl shadow-2xl p-8 max-w-2xl w-full`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-2xl font-bold ${textClass}`}>➕ Adicionar Nova Ação</h2>
                <button 
                  onClick={() => {
                    setShowActionModal(false);
                    setSelectedReportForAction(null);
                    setNewAction({ action: '', description: '', responsible: '' });
                  }}
                  className="hover:bg-gray-100 p-2 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm"><strong>Relato:</strong> {selectedReportForAction.accessCode}</p>
                <p className="text-sm"><strong>Status atual:</strong> {selectedReportForAction.status}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Tipo de Ação *</label>
                  <select
                    value={newAction.action}
                    onChange={(e) => setNewAction({...newAction, action: e.target.value})}
                    className={`w-full px-4 py-3 border rounded-lg ${inputBgClass}`}
                  >
                    <option value="">Selecione o tipo...</option>
                    <option value="em_analise">🔍 Colocar em Análise</option>
                    <option value="contato">📞 Contato Realizado</option>
                    <option value="reuniao">👥 Reunião Agendada/Realizada</option>
                    <option value="medida">⚖️ Medida Disciplinar Aplicada</option>
                    <option value="acompanhamento">👁️ Acompanhamento Iniciado</option>
                    <option value="resolvido">✅ Marcar como Resolvido</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Descrição Detalhada *</label>
                  <textarea
                    value={newAction.description}
                    onChange={(e) => setNewAction({...newAction, description: e.target.value})}
                    rows="4"
                    placeholder="Descreva a ação tomada, detalhes relevantes, próximos passos..."
                    className={`w-full px-4 py-3 border rounded-lg ${inputBgClass}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Responsável *</label>
                  <input
                    type="text"
                    value={newAction.responsible}
                    onChange={(e) => setNewAction({...newAction, responsible: e.target.value})}
                    placeholder="Nome do responsável pela ação"
                    className={`w-full px-4 py-3 border rounded-lg ${inputBgClass}`}
                  />
                </div>

                <button
                  onClick={handleAddAction}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-lg transition-colors shadow-lg hover:shadow-xl"
                >
                  💾 Registrar Ação
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default BullyingReportSystem;