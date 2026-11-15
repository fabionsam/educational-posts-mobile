import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import api, { updateBaseUrl, DEFAULT_API_URL } from '../services/api';
import { theme } from '../styles/theme';

export default function ProfileScreen({ navigation }) {
  const { user, isAuthenticated, logout } = useAuth();
  const [apiUrl, setApiUrl] = useState(api.defaults.baseURL || DEFAULT_API_URL);
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem('@EduBlog:apiUrl').then((stored) => {
      if (stored) setApiUrl(stored);
      else setApiUrl(api.defaults.baseURL);
    });
  }, []);

  const handleSaveApiUrl = async () => {
    if (!apiUrl.trim()) {
      Alert.alert('Atenção', 'Informe a URL base da API.');
      return;
    }
    await updateBaseUrl(apiUrl.trim());
    Alert.alert('Configuração Salva', `URL da API atualizada para:\n${apiUrl.trim()}`);
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setConnectionStatus(null);
    try {
      await updateBaseUrl(apiUrl.trim());
      const response = await api.get('/posts?limit=1');
      if (response.status === 200) {
        setConnectionStatus({ success: true, message: 'Conectado com sucesso à API!' });
      } else {
        setConnectionStatus({ success: false, message: `Resposta inesperada: ${response.status}` });
      }
    } catch (err) {
      setConnectionStatus({
        success: false,
        message: err.message || 'Falha ao conectar à API.',
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const handleResetApiUrl = async () => {
    setApiUrl(DEFAULT_API_URL);
    await updateBaseUrl(DEFAULT_API_URL);
    Alert.alert('Restaurado', `URL restaurada para o padrão:\n${DEFAULT_API_URL}`);
  };

  const handleLogout = () => {
    Alert.alert('Confirmação', 'Deseja realmente sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: logout },
    ]);
  };

  const getRoleBadgeStyle = (role) => {
    if (role === 'admin' || role === 'administrador') return { bg: '#FEE2E2', text: '#DC2626', label: 'Administrador' };
    if (role === 'professor') return { bg: '#E0E7FF', text: '#4338CA', label: 'Professor' };
    return { bg: '#D1FAE5', text: '#059669', label: 'Aluno' };
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.heading}>Perfil & Configurações</Text>
        <Text style={styles.subheading}>Gerencie sua sessão e conexão com o servidor</Text>

        {isAuthenticated && user ? (
          <View style={styles.card}>
            <View style={styles.userHeader}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={32} color={theme.colors.primary} />
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
                {(() => {
                  const badge = getRoleBadgeStyle(user.role);
                  return (
                    <View style={[styles.roleBadge, { backgroundColor: badge.bg }]}>
                      <Text style={[styles.roleBadgeText, { color: badge.text }]}>
                        {badge.label}
                      </Text>
                    </View>
                  );
                })()}
              </View>
            </View>

            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color={theme.colors.danger} />
              <Text style={styles.logoutBtnText}>Encerrar Sessão</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.card}>
            <View style={styles.guestInfo}>
              <Ionicons name="person-circle-outline" size={48} color={theme.colors.textMuted} />
              <Text style={styles.guestTitle}>Modo Convidado (Público)</Text>
              <Text style={styles.guestSubtitle}>
                Você pode visualizar e ler postagens livremente sem login. Para criar postagens ou gerenciar usuários, faça login.
              </Text>
              <TouchableOpacity
                style={styles.loginBtn}
                onPress={() => navigation.navigate('Login')}
              >
                <Ionicons name="log-in-outline" size={20} color="#fff" />
                <Text style={styles.loginBtnText}>Fazer Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* API Server Configuration Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="server-outline" size={22} color={theme.colors.primary} />
            <Text style={styles.cardTitle}>Conexão com a API</Text>
          </View>
          <Text style={styles.cardCaption}>
            Configure a URL do backend Node.js. Para testar no celular via Expo Go, informe o IP local da sua máquina (ex: http://192.168.1.15:3000).
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>URL Base do Backend</Text>
            <TextInput
              style={styles.input}
              value={apiUrl}
              onChangeText={setApiUrl}
              placeholder="http://192.168.x.x:3000"
              placeholderTextColor={theme.colors.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.btnAction, styles.btnPrimary]}
              onPress={handleSaveApiUrl}
            >
              <Ionicons name="save-outline" size={18} color="#fff" />
              <Text style={styles.btnActionText}>Salvar URL</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btnAction, styles.btnSecondary]}
              onPress={handleTestConnection}
              disabled={testingConnection}
            >
              {testingConnection ? (
                <ActivityIndicator size="small" color={theme.colors.primary} />
              ) : (
                <>
                  <Ionicons name="wifi-outline" size={18} color={theme.colors.primary} />
                  <Text style={[styles.btnActionText, { color: theme.colors.primary }]}>
                    Testar
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.resetBtn} onPress={handleResetApiUrl}>
            <Text style={styles.resetBtnText}>Restaurar URL Padrão ({DEFAULT_API_URL})</Text>
          </TouchableOpacity>

          {connectionStatus && (
            <View
              style={[
                styles.statusBox,
                connectionStatus.success ? styles.statusSuccess : styles.statusError,
              ]}
            >
              <Ionicons
                name={connectionStatus.success ? 'checkmark-circle' : 'alert-circle'}
                size={20}
                color={connectionStatus.success ? '#059669' : '#DC2626'}
              />
              <Text
                style={[
                  styles.statusText,
                  { color: connectionStatus.success ? '#059669' : '#DC2626' },
                ]}
              >
                {connectionStatus.message}
              </Text>
            </View>
          )}
        </View>

        {/* Informações da Entrega Fase 4 */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="school-outline" size={22} color={theme.colors.primary} />
            <Text style={styles.cardTitle}>Tech Challenge - Fase 04</Text>
          </View>
          <Text style={styles.projectText}>
            • Projeto: Educational Posts Mobile App{'\n'}
            • Arquitetura: React Native com Expo (SDK 52){'\n'}
            • Backend: Node.js / Express REST API{'\n'}
            • Funcionalidades: Feed com busca, Leitura completa, Painel Administrativo de Postagens, Gestão de Docentes e Discentes com paginação, Autenticação JWT com persistência.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  heading: {
    fontSize: theme.typography.title,
    fontWeight: '700',
    color: theme.colors.textDark,
  },
  subheading: {
    fontSize: theme.typography.caption,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.lg,
    marginTop: 4,
  },
  card: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.card,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: theme.typography.subtitle,
    fontWeight: '700',
    color: theme.colors.textDark,
  },
  userEmail: {
    fontSize: theme.typography.caption,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginTop: 6,
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: theme.spacing.lg,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    borderRadius: theme.borderRadius.sm,
    backgroundColor: '#FEF2F2',
  },
  logoutBtnText: {
    color: theme.colors.danger,
    fontWeight: '600',
    fontSize: theme.typography.body,
  },
  guestInfo: {
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  guestTitle: {
    fontSize: theme.typography.subtitle,
    fontWeight: '700',
    color: theme.colors.textDark,
    marginTop: 8,
  },
  guestSubtitle: {
    fontSize: theme.typography.caption,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: theme.spacing.lg,
    lineHeight: 18,
  },
  loginBtn: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.sm,
  },
  loginBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: theme.typography.body,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: theme.typography.subtitle,
    fontWeight: '600',
    color: theme.colors.textDark,
  },
  cardCaption: {
    fontSize: theme.typography.caption,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.md,
    lineHeight: 18,
  },
  inputGroup: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.typography.caption,
    fontWeight: '600',
    color: theme.colors.textDark,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
    fontSize: theme.typography.body,
    color: theme.colors.textDark,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  btnAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.sm,
  },
  btnPrimary: {
    backgroundColor: theme.colors.primary,
  },
  btnSecondary: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  btnActionText: {
    fontWeight: '600',
    fontSize: theme.typography.caption,
    color: '#fff',
  },
  resetBtn: {
    marginTop: 12,
    alignItems: 'center',
  },
  resetBtnText: {
    color: theme.colors.textMuted,
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    marginTop: theme.spacing.md,
  },
  statusSuccess: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  statusError: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  statusText: {
    fontSize: theme.typography.caption,
    fontWeight: '500',
    flex: 1,
  },
  projectText: {
    fontSize: theme.typography.caption,
    color: theme.colors.textMuted,
    lineHeight: 20,
    marginTop: 4,
  },
});
