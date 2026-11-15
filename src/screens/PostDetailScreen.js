import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { theme } from '../styles/theme';

export default function PostDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const { user, isAdmin } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setError(null);
        const response = await api.get(`/posts/${id}`);
        setPost(response.data);
      } catch (err) {
        setError('Não foi possível carregar a postagem.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const isAuthor = user && (user.id === post?.userId || user.name === post?.author);
  const canModify = isAdmin || isAuthor;

  const performDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/posts/${id}`);
      Alert.alert('Sucesso', 'Postagem excluída com sucesso.');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Erro', err.response?.data?.error || 'Erro ao excluir postagem.');
      setDeleting(false);
    }
  };

  const handleDelete = () => {
    if (Platform.OS === 'web') {
      const confirmed = typeof window !== 'undefined' ? window.confirm('Tem certeza de que deseja excluir esta postagem?') : true;
      if (confirmed) {
        performDelete();
      }
      return;
    }

    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza de que deseja excluir esta postagem?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: performDelete,
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error || !post) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={theme.colors.danger} />
        <Text style={styles.errorText}>{error || 'Post não encontrado.'}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{post.title}</Text>

        <View style={styles.metaContainer}>
          <View style={styles.authorRow}>
            <Ionicons name="person-circle" size={20} color={theme.colors.primary} />
            <Text style={styles.authorText}>
              Por <Text style={styles.authorName}>{post.author || 'Docente'}</Text>
            </Text>
          </View>
          <View style={styles.dateRow}>
            <Ionicons name="time-outline" size={16} color={theme.colors.textMuted} />
            <Text style={styles.dateText}>{formatDate(post.createdAt)}</Text>
          </View>
        </View>

        {canModify && (
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.editBtn]}
              onPress={() => navigation.navigate('EditPost', { id: post.id })}
            >
              <Ionicons name="pencil" size={16} color={theme.colors.primary} />
              <Text style={styles.editBtnText}>Editar Post</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, styles.deleteBtn]}
              onPress={handleDelete}
              disabled={deleting}
            >
              <Ionicons name="trash-outline" size={16} color={theme.colors.danger} />
              <Text style={styles.deleteBtnText}>{deleting ? 'Excluindo...' : 'Excluir'}</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.divider} />

        <Text style={styles.content}>{post.content}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    lineHeight: 32,
    marginBottom: theme.spacing.md,
  },
  metaContainer: {
    marginBottom: theme.spacing.md,
    gap: 6,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  authorText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  authorName: {
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 13,
    color: theme.colors.textMuted,
  },
  actionRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: theme.borderRadius.md,
    gap: 6,
  },
  editBtn: {
    backgroundColor: theme.colors.primaryLight,
  },
  editBtnText: {
    color: theme.colors.primary,
    fontWeight: '600',
    fontSize: 13,
  },
  deleteBtn: {
    backgroundColor: theme.colors.dangerLight,
  },
  deleteBtnText: {
    color: theme.colors.danger,
    fontWeight: '600',
    fontSize: 13,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.md,
  },
  content: {
    fontSize: 16,
    lineHeight: 26,
    color: '#334155',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
  },
  errorText: {
    fontSize: 15,
    color: theme.colors.danger,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
});
