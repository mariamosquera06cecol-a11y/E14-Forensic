const { supabase } = require('../services/supabase');

test(
  'Detectar fraude electoral',
  async () => {

    const { data: formularios, error: errorFormularios } =
      await supabase
        .from('e14_forms')
        .select('*');

    expect(errorFormularios).toBeNull();

    const { data: mesas, error: errorMesas } =
      await supabase
        .from('polling_tables')
        .select('*');

    expect(errorMesas).toBeNull();

    const fraude = formularios.filter((formulario) => {

      const mesa = mesas.find(
        (m) => m.table_number === formulario.table_id
      );

      if (!mesa) return false;

      const total =
        formulario.candidate_a_votes +
        formulario.candidate_b_votes +
        formulario.blank_votes +
        formulario.null_votes;

      return total > mesa.registered_voters;
    });

    expect(fraude.length).toBeGreaterThan(0);

  },
  15000
);