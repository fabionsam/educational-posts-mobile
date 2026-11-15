import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import api from '../services/api';
import { theme } from '../styles/theme';

export default function StudentsListScreen({ navigation }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  const fetchStudents = async (pageToFetch = 1, searchQuery = '') => {
    try {
      const response = await api.get(
        `/users?role=aluno&page=${pageToFetch}&limit=6&search=${encodeURIComponent(searchQuery)}`
      );
      setStudents(response.data.users);
      setPage(response.data.page);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.warn('Erro ao carregar alunos:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchStudents(page, search);
    }, [page, search])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchStudents(page, search);
  };

  const handleDelete = (id, name) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Deseja realmente remover o aluno "${name}" do sistema?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/users/${id}`);
              Alert.alert('Sucesso', 'Aluno excluído com sucesso.');
              fetchStudents(page, search);
            } catch (err) {
              Alert.alert('Erro', err.response?.data?.error || 'Erro ao excluir aluno.');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.infoCol}>
        <View style={styles.nameRow}>
          <Ionicons name="person-outline" size={18} color={theme.colors.success} />
          <Text style={styles.nameText}>{item.name}</Text>
        </View>
        <Text style={styles.emailText}>{item.email}</Text>
      </View>

      <View style={styles.actionCol}>
        <TouchableOpacity
          style={[styles.btn, styles.editBtn]}
          onPress={() => navigation.navigate('EditStudent', { id: item.id })}
        >
          <Ionicons name="pencil" size={16} color={theme.colors.warning} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.deleteBtn]}
          onPress={() => handleDelete(item.id, item.name)}
        >
          <Ionicons name="trash" size={16} color={theme.colors.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gestão de Alunos</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('CreateStudent')}
        >
          <Ionicons name="person-add" size={18} color="#fff" />
          <Text style={styles.addBtnText}>Novo Aluno</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color={theme.colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Filtrar por nome ou e-mail..."
          placeholderTextColor={theme.colors.textMuted}
          value={search}
          onChangeText={(text) => {
            setSearch(text);
            setPage(1);
          }}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={theme.colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : students.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name="people-outline" size={48} color={theme.colors.textMuted} />
          <Text style={styles.emptyText}>Nenhum aluno encontrado.</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={students}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
            }
          />

          {/* Paginação */}
          <View style={styles.paginationBar}>
            <TouchableOpacity
              style={[styles.pageBtn, page <= 1 && styles.pageBtnDisabled]}
              onPress={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page <= 1}
            >
              <Ionicons name="chevron-back" size={18} color={page <= 1 ? '#cbd5e1' : theme.colors.primary} />
              <Text style={[styles.pageBtnText, page <= 1 && styles.pageTextDisabled]}>Anterior</Text>
            </TouchableOpacity>

            <Text style={styles.pageIndicator}>
              Pág. {page} de {totalPages}
            </Text>

            <TouchableOpacity
              style={[styles.pageBtn, page >= totalPages && styles.pageBtnDisabled]}
              onPress={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page >= totalPages}
            >
              <Text style={[styles.pageBtnText, page >= totalPages && styles.pageTextDisabled]}>Próxima</Text>
              <Ionicons name="chevron-forward" size={18} color={page >= totalPages ? '#cbd5e1' : theme.colors.primary} />
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: theme.borderRadius.md,
    gap: 4,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    margin: theme.spacing.md,
    paddingHorizontal: 12,
    height: 44,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  listContent: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: 80,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  infoCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  nameText: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  emailText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  actionCol: {
    flexDirection: 'row',
    gap: 8,
  },
  btn: {
    padding: 8,
    borderRadius: theme.borderRadius.sm,
  },
  editBtn: {
    backgroundColor: theme.colors.warningLight,
  },
  deleteBtn: {
    backgroundColor: theme.colors.dangerLight,
  },
  paginationBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  pageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pageBtnDisabled: {
    opacity: 0.5,
  },
  pageBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  pageTextDisabled: {
    color: theme.colors.textMuted,
  },
  pageIndicator: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyText: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
  },
});
