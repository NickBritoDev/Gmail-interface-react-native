import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StatusBar, Platform, StyleSheet, ActivityIndicator, Keyboard } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';

const statusBarHeight = StatusBar.currentHeight;
const KEY_OPEN_IA = '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'

export default function App() {
  const [loading, setLoading] = useState(false);
  const [petList, setPetList] = useState('');

  const [formData, setFormData] = useState({
    idade: 18,
    quantidadePessoas: 1,
    quantidadeCriancas: 1,
    portePreferencia: 'Pequeno',
    quintalDisponibilidade: 'Sem Quintal',
    pelagemTipo: 'Tanto faz',
  });

  const handleFormChange = (fieldName: string, value: string | number) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: value,
    }));
  };

  const handleCreateRecommendations = async () => {
    setPetList('')
    setLoading(true)
    Keyboard.dismiss()

    await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${KEY_OPEN_IA}`,
      },
      body: JSON.stringify({
        "model": "gpt-3.5-turbo",
        "messages": [
          {
            "role": "user",
            "content": `Olá, tenho ${formData.idade} anos e decidi que quero ter um animal de estimação, seja um gato ou um cachorro, seja adotado ou comprado. Gostaria de obter uma lista de ONGs para adoção e uma lista de raças disponíveis para compra. Em minha casa, somos ${formData.quantidadePessoas} pessoas, sendo um total de ${formData.quantidadeCriancas} crianças, e em relação ao espaço externo,  ${formData.quintalDisponibilidade}. O porte do animal pode ser  ${formData.portePreferencia}, e o tipo de pelagem é  ${formData.pelagemTipo}. Poderia me fornecer informações com base nessas preferências?`
          },
        ],
        temperature: 0.20,
        max_tokens: 500,
        top_p: 1,
      })
    })
      .then((response) => response.json())
      .then((data) => {
        setPetList(data.choices[0].message.content);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false)
      })
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Escolha certa 🐾</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Sua idade: {formData.idade.toFixed(0)}</Text>
        <Slider
          minimumValue={18}
          maximumValue={75}
          minimumTrackTintColor="orange"
          maximumTrackTintColor="#000000"
          onValueChange={(value) => handleFormChange('idade', value)}
        />

        <Text style={styles.label}>Quantidade de pessoas na casa: {formData.quantidadePessoas.toFixed(0)}</Text>
        <Slider
          minimumValue={1}
          maximumValue={10}
          minimumTrackTintColor="orange"
          maximumTrackTintColor="#000000"
          onValueChange={(value) => handleFormChange('quantidadePessoas', value)}
        />

        <Text style={styles.label}>Quantidade de crianças na casa: {formData.quantidadeCriancas.toFixed(0)}</Text>
        <Slider
          minimumValue={0}
          maximumValue={10}
          minimumTrackTintColor="orange"
          maximumTrackTintColor="#000000"
          onValueChange={(value) => handleFormChange('quantidadeCriancas', value)}
        />

        <Text style={styles.label}>Preferência de porte</Text>
        <View style={styles.picker}>
          <Picker
            selectedValue={formData.portePreferencia}
            onValueChange={(itemValue) => handleFormChange('portePreferencia', itemValue)}
          >
            <Picker.Item label="Pequeno" value="Pequeno" />
            <Picker.Item label="Medio" value="Medio" />
            <Picker.Item label="Grande" value="Grande" />
          </Picker>
        </View>

        <Text style={styles.label}>Disponibilidade de quintal</Text>
        <View style={styles.picker}>
          <Picker
            selectedValue={formData.quintalDisponibilidade}
            onValueChange={(itemValue) => handleFormChange('quintalDisponibilidade', itemValue)}
          >
            <Picker.Item label="Sem Quintal" value="Sem Quintal" />
            <Picker.Item label="Pequeno" value="Pequeno" />
            <Picker.Item label="Medio" value="Medio" />
            <Picker.Item label="Grande" value="Grande" />
          </Picker>
        </View>

        <Text style={styles.label}>Tipo de pelagem</Text>
        <View style={styles.picker}>
          <Picker
            selectedValue={formData.pelagemTipo}
            onValueChange={(itemValue) => handleFormChange('pelagemTipo', itemValue)}
          >
            <Picker.Item label="Tanto faz" value="Tanto faz" />
            <Picker.Item label="Pequeno" value="Pequeno" />
            <Picker.Item label="Medio" value="Medio" />
            <Picker.Item label="Grande" value="Grande" />
          </Picker>
        </View>
      </View>

      <Pressable style={styles.button} onPress={handleCreateRecommendations}>
        <Text style={styles.buttonText}>Criar Recomendações</Text>
        <MaterialIcons name='pets' size={24} color={'white'} />
      </Pressable>

      {petList && (
        <>
          <View style={styles.content}>
            <Text style={styles.title}>Seu pet ideal 👇</Text>
            <Text style={styles.list}>{petList}</Text>
            <Pressable style={styles.button} onPress={() => { setPetList('') }}>
              <Text style={styles.buttonText}>Filtrar Novamente</Text>
              <MaterialIcons name='replay' size={24} color={'white'} />
            </Pressable>
          </View>

        </>
      )}

      {loading && (
        <View style={styles.contentLoading}>
          <Text style={styles.title}>Carregando seus pets 🥹</Text>
          <ActivityIndicator color={'#000'} size={'large'} />
        </View>
      )}



    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    alignItems: 'center',
    paddingBottom: 20,
    paddingHorizontal: 12
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000000',
    paddingTop: Platform.OS === 'android' ? statusBarHeight : 50,
    textAlign: 'left',
    width: '100%',
    marginLeft: 8
  },
  form: {
    width: '99%',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fff',
    marginTop: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  label: {
    fontWeight: '400',
    fontSize: 18,
    marginTop: 8,
    marginLeft: 12
  },
  picker: {
    borderBottomColor: '#cccccc',
    borderBottomWidth: 0.5,
    width: '98%',
    margin: 'auto'
  },
  button: {
    backgroundColor: 'orange',
    width: '98%',
    margin: 'auto',
    borderRadius: 10,
    padding: 14,
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff'
  },
  contentLoading: {
    position: 'absolute',
    bottom: 10,
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
    margin: 'auto',
    borderRadius: 10,
    padding: 14,
    marginTop: 40
  },
  content: {
    position: 'absolute',
    top: 0,
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
    margin: 'auto',
    borderRadius: 10,
    padding: 14,
    marginTop: 40
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 20
  },
  list: {
    fontSize: 16
  }
});
