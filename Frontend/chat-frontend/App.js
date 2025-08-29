import React, { useEffect, useState, useCallback } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Dimensions,
} from "react-native";

// Constantes para a URL da API
//Ip da Maquina
const API_URL = "http://Ip da Maquina:8090/projeto/api/v1/chat";

export default function App() {
  const [mensagens, setMensagens] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [nome, setNome] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Tamanho da tela
  const { width } = Dimensions.get("window");
  const isMobile = width < 768;

  const formatDate = (date) => {
    // Tente instanciar a data passando no formato ISO 8601
    const formattedDate = new Date(date);

    // Verifique se a data é inválida
    if (isNaN(formattedDate)) {
      console.error("Data inválida:", date);
      return "Data inválida";
    }

    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    return formattedDate.toLocaleDateString("pt-BR", options);
  };

  // Função para buscar mensagens
  const fetchAll = useCallback(async () => {
    try {
      setLoadingList(true);
      const res = await fetch(API_URL, { method: "GET" });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`GET falhou: ${res.status} ${errorText}`);
      }

      const data = await res.json();
      if (Array.isArray(data)) {
        setMensagens(data);
      } else {
        throw new Error("Resposta da API no formato inesperado.");
      }
    } catch (err) {
      console.error("Erro ao buscar mensagens:", err);
      Alert.alert("Erro ao buscar mensagens", String(err?.message || err));
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    fetchAll(); // Chama a função ao carregar o componente

    // Configura a atualização automática a cada 5 segundos
    const intervalId = setInterval(fetchAll, 5000); // 5000 ms = 5 segundos

    // Limpa o intervalo quando o componente for desmontado
    return () => {
      clearInterval(intervalId);
    };
  }, [fetchAll]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAll();
    setRefreshing(false);
  }, [fetchAll]);

  const validar = () => {
    if (!nome.trim()) {
      Alert.alert("Validação", "Informe um Nome.");
      return false;
    }
    if (!mensagem.trim()) {
      Alert.alert("Validação", "Informe a mensagem.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validar()) return;

    const currentDate = new Date().toISOString(); // Captura a data atual no formato ISO

    const payload = {
      nome: nome.trim(),
      mensagem: mensagem.trim(),
      data: currentDate, // Envia a data junto com a mensagem
    };

    try {
      setSubmitting(true);
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        throw new Error(`POST falhou: ${res.status} ${errText}`);
      }

      await fetchAll();
      setMensagem("");
      //Alert.alert("Sucesso", "Mensagem enviada!");
    } catch (err) {
      Alert.alert("Erro ao enviar", String(err?.message || err));
    } finally {
      setSubmitting(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>
        {item.nome}:
        <Text style={styles.muted}> {item.mensagem ?? "Sem Mensagem"}</Text>
      </Text>
      {/* Exibindo a data formatada */}
      <Text style={styles.cardDate}>{formatDate(item.data)}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.seguro}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={{ flex: 1 }}
      >
        <View
          style={[
            styles.container,
            isMobile ? styles.mobileContainer : styles.webContainer,
          ]}
        >
          {/* Área de Envio de Mensagem (Em cima no mobile) */}
          {isMobile && (
            <View style={styles.mobileFormContainer}>
              <Text style={styles.titulo}>Envio de Mensagem</Text>

              <View style={styles.formulario}>
                <View style={styles.field}>
                  <Text style={styles.texto}>Nome</Text>
                  <TextInput
                    value={nome}
                    onChangeText={setNome}
                    style={styles.entrada}
                    placeholder="ex.: Andre"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.field}>
                  <Text style={styles.texto}>Mensagem</Text>
                  <TextInput
                    value={mensagem}
                    onChangeText={setMensagem}
                    style={styles.entrada}
                    placeholder="ex.: Oi"
                    autoCapitalize="none"
                  />
                </View>

                <TouchableOpacity
                  disabled={submitting}
                  style={[styles.button, submitting && { opacity: 0.6 }]}
                  onPress={handleSubmit}
                >
                  {submitting ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonTexto}>Enviar</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Área das Mensagens Cadastradas */}
          <View
            style={
              isMobile ? styles.mobileListContainer : styles.webListContainer
            }
          >
            <View style={styles.listHeader}>
              <Text style={styles.sectionTitle}>Mensagens Cadastradas</Text>
              <TouchableOpacity onPress={fetchAll} style={styles.linkBtn}>
                <Text style={styles.linkText}>Atualizar</Text>
              </TouchableOpacity>
            </View>

            {loadingList ? (
              <ActivityIndicator style={{ marginTop: 8 }} />
            ) : (
              <FlatList
                data={mensagens}
                keyExtractor={(it, idx) => String(it?.id ?? idx)}
                renderItem={renderItem}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
                ListEmptyComponent={
                  <Text style={styles.empty}>Nenhuma mensagem cadastrada.</Text>
                }
                contentContainerStyle={{ paddingBottom: 40 }}
              />
            )}
          </View>

          {/* Área de Envio de Mensagem (Somente à direita na versão web) */}
          {!isMobile && (
            <View style={styles.webFormContainer}>
              <Text style={styles.titulo}>Envio de Mensagem</Text>

              <View style={styles.formulario}>
                <View style={styles.field}>
                  <Text style={styles.texto}>Nome</Text>
                  <TextInput
                    value={nome}
                    onChangeText={setNome}
                    style={styles.entrada}
                    placeholder="ex.: Andre"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.field}>
                  <Text style={styles.texto}>Mensagem</Text>
                  <TextInput
                    value={mensagem}
                    onChangeText={setMensagem}
                    style={styles.entrada}
                    placeholder="ex.: Oi"
                    autoCapitalize="none"
                  />
                </View>

                <TouchableOpacity
                  disabled={submitting}
                  style={[styles.button, submitting && { opacity: 0.6 }]}
                  onPress={handleSubmit}
                >
                  {submitting ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonTexto}>Enviar</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  seguro: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingTop: Platform.OS === "ios" ? 30 : 10,
  },
  // Estilos para mobile (celular)
  mobileContainer: {
    flex: 1,
    flexDirection: "column",
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  mobileFormContainer: {
    width: "100%",
    marginBottom: 20, // Adiciona um espaço entre o formulário e a lista
  },
  mobileListContainer: {
    flex: 1, // <<< A CORREÇÃO ESTÁ AQUI
    width: "100%",
    marginTop: 20, // Adiciona um espaço entre o envio de mensagem e a lista de mensagens
  },

  // Estilos para web (Somente envio à direita)
  webContainer: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  webFormContainer: {
    width: "35%",
    marginLeft: "auto",
  },
  webListContainer: {
    width: "63%",
    marginRight: "auto", // Certificando-se que a lista esteja à esquerda
  },

  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  formulario: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  field: {
    marginBottom: 15,
  },
  texto: {
    fontSize: 16,
    fontWeight: "500",
    color: "#181818ff",
    marginBottom: 5,
  },
  entrada: {
    height: 45,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  button: {
    backgroundColor: "#0066cc",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
    marginTop: 15,
  },
  buttonTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  listHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  linkBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#ddd",
    borderRadius: 5,
  },
  linkText: {
    color: "#0066cc",
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  cardDate: {
    fontSize: 14,
    color: "#777",
    marginTop: 5,
  },
  muted: {
    color: "#777",
  },
  empty: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
  },
});
