/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class HitosActor extends Actor {
  /**
   * Augment the basic actor data with additional dynamic data.
   */
  prepareData() {
    super.prepareData();

    const actorData = this.data;
    const data = actorData.data;
    const flags = actorData.flags;

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    if(actorData.type === "npc" || actorData.type === "character"){
    this._prepareCharacterData(actorData);
    this._calculateRD(actorData)}
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actorData) {
    const data = actorData.data;
    
    data.aguante.value =
      data.atributos.for.value + Math.floor(data.atributos.vol.value / 2);
    data.entereza.value =
      data.atributos.vol.value + Math.floor(data.atributos.int.value / 2);

    data.resistencia.max = data.aguante.value * 3;
    data.estabilidadMental.max = data.entereza.value * 3;

    data.defensa.normal =
      data.atributos.ref.value +
      (data.habilidades.ffisica.value >= data.habilidades.combate.value
        ? data.habilidades.ffisica.value
        : data.habilidades.combate.value) +
      5;
    data.defensa.des = data.defensa.normal - 2;

    var resistencia = Number(data.resistencia.value);
    var resistencia_Max = Number(data.aguante.value);
    console.log(resistencia, resistencia_Max)
    if (resistencia < resistencia_Max) {
      data.resistencia.status = game.i18n.format("Hitos.Salud.Sano");
      data.resistencia.mod = 0;
    } else if (resistencia_Max <= resistencia && resistencia < 2 * resistencia_Max) {
      data.resistencia.status = game.i18n.format("Hitos.Salud.Herido");
      data.resistencia.mod = -2;
    } else if (2 * resistencia_Max <= resistencia && resistencia  < 3 * resistencia_Max) {
      data.resistencia.status = game.i18n.format("Hitos.Salud.Incapacitado");
      data.resistencia.mod = -5;
    } else {
      data.resistencia.status = game.i18n.format("Hitos.Salud.Moribundo");
      data.resistencia.mod = -5;
    }

    var estMental = Number(data.estabilidadMental.value);
    var estMental_Max = Number(data.entereza.value);

    if (estMental < estMental_Max) {
      data.estabilidadMental.status = game.i18n.format("Hitos.Mental.Cuerdo");
      data.estabilidadMental.mod = 0;
    } else if (estMental_Max <= estMental && estMental < 2 * estMental_Max) {
      data.estabilidadMental.status = game.i18n.format("Hitos.Mental.Alterado");
      data.estabilidadMental.mod = -2;
    } else if (2 * estMental_Max <= estMental && estMental < 3 * estMental_Max) {
      data.estabilidadMental.status = game.i18n.format(
        "Hitos.Mental.Trastornado"
      );
      data.estabilidadMental.mod = -5;
    } else {
      data.estabilidadMental.status = game.i18n.format(
        "Hitos.Mental.Enloquecido"
      );
      data.estabilidadMental.mod = -5;
    }

    data.iniciativa =
      data.atributos.ref.value + Math.floor(data.atributos.int.value / 2);

    data.danio.cuerpo = Math.floor(
      (data.habilidades.combate.value + data.atributos.for.value) / 4
    );
    data.danio.distancia = Math.floor(data.habilidades.combate.value / 4);
  }

  _calculateRD(actorData){
    let RD = 0;
    
    actorData.items.forEach(item => {
      if (item.type === 'armor' && item.data.equipped === true) {RD += item.data.rd}
    });

    console.log(actorData)
    actorData.data.rd = RD

  }
}
