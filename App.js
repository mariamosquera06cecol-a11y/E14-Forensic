import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

import { supabase } from './src/services/supabase';

export default function App() {

  const [mesas, setMesas] = useState([]);
  const [fraudes, setFraudes] = useState([]);

  const cargarDatos = async () => {

    const { data, error } = await supabase
      .from('e14_forms')
      .select('*');

    if (error) {
      console.log(error);
      return;
    }

    setMesas(data);
  };

  const ejecutarAuditoria = async () => {

    const { data } = await supabase
      .from('e14_forms')
      .select('*');

    const { data: mesasRegistradas } = await supabase
      .from('polling_tables')
      .select('*');

    const hallazgos = [];

    data.forEach(formulario => {

      const mesa = mesasRegistradas.find(
        m => m.table_number === formulario.table_id
      );

      const total =
        formulario.candidate_a_votes +
        formulario.candidate_b_votes +
        formulario.blank_votes +
        formulario.null_votes;

      if (total > mesa.registered_voters) {
        hallazgos.push({
          mesa: formulario.table_id,
          total,
          limite: mesa.registered_voters
        });
      }
    });

    setFraudes(hallazgos);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        E-14 FORENSIC ENGINE
      </Text>

      <FlatList
        data={mesas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {

          const total =
            item.candidate_a_votes +
            item.candidate_b_votes +
            item.blank_votes +
            item.null_votes;

          return (
            <View style={styles.card}>

              <Text style={styles.text}>
                Mesa: {item.table_id}
              </Text>

              <Text style={styles.text}>
                Total votos: {total}
              </Text>

            </View>
          );
        }}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={ejecutarAuditoria}
      >
        <Text style={styles.buttonText}>
          [ RUN FORENSIC AUDIT ]
        </Text>
      </TouchableOpacity>

      {fraudes.map((f, index) => (
        <Text
          key={index}
          style={styles.alert}
        >
          FRAUDE DETECTADO - Mesa {f.mesa}
        </Text>
      ))}

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
    paddingTop: 60
  },

  title: {
    color: '#00FF00',
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold'
  },

  card: {
    borderWidth: 1,
    borderColor: '#00FF00',
    marginBottom: 10,
    padding: 10
  },

  text: {
    color: '#00FF00'
  },

  button: {
    borderWidth: 2,
    borderColor: '#00FF00',
    padding: 15,
    marginTop: 20
  },

  buttonText: {
    color: '#00FF00',
    textAlign: 'center',
    fontWeight: 'bold'
  },

  alert: {
    color: 'red',
    marginTop: 10,
    fontWeight: 'bold'
  }

});