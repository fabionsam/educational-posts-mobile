import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { theme } from '../styles/theme';

export default function ProfileScreen({ navigation }) {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      const confirmed =
        typeof window !== 'undefined'
          ? window.confirm('Deseja realmente sair da sua conta?')
          : true;
      if (confirmed) {
        logout();
      }
      return;
    }
    Alert.alert('Confirmação', 'Deseja realmente sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: logout },
    ]);
  };

  const getRoleBadgeStyle = (role) => {
    if (role === 'admin' || role === 'administrador')
      return { bg: '#FEE2E2', text: '#DC2626', label: 'Administrador' };
    if (role === 'professor')
      return { bg: '#E0E7FF', text: '#4338CA', label: 'Professor' };
    return { bg: '#D1FAE5', text: '#059669', label: 'Aluno' };
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.heading}>Perfil & Sessão</Text>
        <Text style={styles.subheading}>Gerencie sua conta e visualize suas informações</Text>

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
  projectText: {
    fontSize: theme.typography.caption,
    color: theme.colors.textMuted,
    lineHeight: 20,
    marginTop: 4,
  },
});
