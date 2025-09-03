<script lang="ts" setup>
const snowpackInput = defineModel('snowpack', { default: 'medium' })
const scenarioInput = defineModel('scenario', { default: 'rcp85' })
const modelInput = defineModel('model', { default: 'CCSM4' })
const eraInput = defineModel('era', { default: '2070-2099' })

const scenarioLabels: Record<string, string> = {
  rcp45: 'RCP 4.5',
  rcp85: 'RCP 8.5',
}

const models: string[] = ['CCSM4', 'GFDL-ESM2M', 'HadGEM2-ES', 'MRI-CGCM3']
const eras: string[] = ['2010-2039', '2040-2069', '2070-2099']

const snowpackLabels: Record<string, string> = {
  low: 'Low',
  medium: 'Medium',
}

const dataLabels: Record<string, string> = {
  '1 to 1': 'High → High',
  '2 to 2': 'Minimal → Minimal',
  '1 to 2': 'High → Minimal',
  '2 to 3': 'Minimal → None',
  '1 to 3': 'High → None',
}

const data: any = {
  CCSM4: {
    rcp45: {
      '2010-2039': {
        low: {
          '1 to 1': '586,512',
          '2 to 2': '25,488',
          '1 to 2': '2,880',
          '2 to 3': '576',
          '1 to 3': '0',
        },
        medium: {
          '1 to 1': '561,600',
          '2 to 2': '31,248',
          '1 to 2': '5,904',
          '2 to 3': '1,008',
          '1 to 3': '144',
        },
      },
      '2040-2069': {
        low: {
          '1 to 1': '574,416',
          '2 to 2': '18,864',
          '1 to 2': '14,688',
          '2 to 3': '8,208',
          '1 to 3': '288',
        },
        medium: {
          '1 to 1': '537,984',
          '2 to 2': '28,224',
          '1 to 2': '27,648',
          '2 to 3': '18,000',
          '1 to 3': '2,016',
        },
      },
      '2070-2099': {
        low: {
          '1 to 1': '558,576',
          '2 to 2': '6,912',
          '1 to 2': '23,328',
          '2 to 3': '20,880',
          '1 to 3': '7,488',
        },
        medium: {
          '1 to 1': '351,648',
          '2 to 2': '11,232',
          '1 to 2': '176,256',
          '2 to 3': '38,160',
          '1 to 3': '39,744',
        },
      },
    },
    rcp85: {
      '2010-2039': {
        low: {
          '1 to 1': '587,232',
          '2 to 2': '22,032',
          '1 to 2': '2,160',
          '2 to 3': '432',
          '1 to 3': '0',
        },
        medium: {
          '1 to 1': '562,176',
          '2 to 2': '29,088',
          '1 to 2': '5,472',
          '2 to 3': '720',
          '1 to 3': '0',
        },
      },
      '2040-2069': {
        low: {
          '1 to 1': '559,152',
          '2 to 2': '5,328',
          '1 to 2': '21,456',
          '2 to 3': '22,464',
          '1 to 3': '8,784',
        },
        medium: {
          '1 to 1': '416,160',
          '2 to 2': '11,808',
          '1 to 2': '119,952',
          '2 to 3': '36,432',
          '1 to 3': '31,536',
        },
      },
      '2070-2099': {
        low: {
          '1 to 1': '465,840',
          '2 to 2': '0',
          '1 to 2': '88,416',
          '2 to 3': '27,792',
          '1 to 3': '35,136',
        },
        medium: {
          '1 to 1': '122,544',
          '2 to 2': '288',
          '1 to 2': '199,008',
          '2 to 3': '49,104',
          '1 to 3': '246,096',
        },
      },
    },
  },
  'GFDL-ESM2M': {
    rcp45: {
      '2010-2039': {
        low: {
          '1 to 1': '587,376',
          '2 to 2': '23,904',
          '1 to 2': '2,016',
          '2 to 3': '0',
          '1 to 3': '0',
        },
        medium: {
          '1 to 1': '563,616',
          '2 to 2': '30,384',
          '1 to 2': '4,032',
          '2 to 3': '0',
          '1 to 3': '0',
        },
      },
      '2040-2069': {
        low: {
          '1 to 1': '588,240',
          '2 to 2': '22,896',
          '1 to 2': '1,152',
          '2 to 3': '0',
          '1 to 3': '0',
        },
        medium: {
          '1 to 1': '563,760',
          '2 to 2': '29,664',
          '1 to 2': '3,888',
          '2 to 3': '0',
          '1 to 3': '0',
        },
      },
      '2070-2099': {
        low: {
          '1 to 1': '588,240',
          '2 to 2': '19,584',
          '1 to 2': '1,152',
          '2 to 3': '2,304',
          '1 to 3': '0',
        },
        medium: {
          '1 to 1': '537,264',
          '2 to 2': '31,968',
          '1 to 2': '30,240',
          '2 to 3': '2,880',
          '1 to 3': '144',
        },
      },
    },
    rcp85: {
      '2010-2039': {
        low: {
          '1 to 1': '589,392',
          '2 to 2': '15,408',
          '1 to 2': '0',
          '2 to 3': '0',
          '1 to 3': '0',
        },
        medium: {
          '1 to 1': '567,648',
          '2 to 2': '17,712',
          '1 to 2': '0',
          '2 to 3': '0',
          '1 to 3': '0',
        },
      },
      '2040-2069': {
        low: {
          '1 to 1': '588,384',
          '2 to 2': '22,752',
          '1 to 2': '1,008',
          '2 to 3': '0',
          '1 to 3': '0',
        },
        medium: {
          '1 to 1': '537,408',
          '2 to 2': '34,704',
          '1 to 2': '30,096',
          '2 to 3': '3,024',
          '1 to 3': '144',
        },
      },
      '2070-2099': {
        low: {
          '1 to 1': '580,032',
          '2 to 2': '21,312',
          '1 to 2': '9,216',
          '2 to 3': '6,480',
          '1 to 3': '144',
        },
        medium: {
          '1 to 1': '424,080',
          '2 to 2': '28,512',
          '1 to 2': '140,112',
          '2 to 3': '16,416',
          '1 to 3': '3,456',
        },
      },
    },
  },
  'HadGEM2-ES': {
    rcp45: {
      '2010-2039': {
        low: {
          '1 to 1': '582,912',
          '2 to 2': '26,640',
          '1 to 2': '6,480',
          '2 to 3': '288',
          '1 to 3': '0',
        },
        medium: {
          '1 to 1': '544,752',
          '2 to 2': '42,048',
          '1 to 2': '22,752',
          '2 to 3': '2,592',
          '1 to 3': '144',
        },
      },
      '2040-2069': {
        low: {
          '1 to 1': '573,264',
          '2 to 2': '10,368',
          '1 to 2': '14,688',
          '2 to 3': '16,848',
          '1 to 3': '1,440',
        },
        medium: {
          '1 to 1': '461,952',
          '2 to 2': '20,160',
          '1 to 2': '94,608',
          '2 to 3': '28,224',
          '1 to 3': '11,088',
        },
      },
      '2070-2099': {
        low: {
          '1 to 1': '561,888',
          '2 to 2': '3,168',
          '1 to 2': '24,336',
          '2 to 3': '24,624',
          '1 to 3': '3,168',
        },
        medium: {
          '1 to 1': '361,584',
          '2 to 2': '10,512',
          '1 to 2': '176,544',
          '2 to 3': '35,424',
          '1 to 3': '29,520',
        },
      },
    },
    rcp85: {
      '2010-2039': {
        low: {
          '1 to 1': '583,632',
          '2 to 2': '26,928',
          '1 to 2': '5,760',
          '2 to 3': '432',
          '1 to 3': '0',
        },
        medium: {
          '1 to 1': '545,904',
          '2 to 2': '41,616',
          '1 to 2': '21,744',
          '2 to 3': '2,304',
          '1 to 3': '0',
        },
      },
      '2040-2069': {
        low: {
          '1 to 1': '557,712',
          '2 to 2': '2,304',
          '1 to 2': '21,744',
          '2 to 3': '25,488',
          '1 to 3': '9,936',
        },
        medium: {
          '1 to 1': '384,048',
          '2 to 2': '9,072',
          '1 to 2': '153,360',
          '2 to 3': '36,864',
          '1 to 3': '30,240',
        },
      },
      '2070-2099': {
        low: {
          '1 to 1': '538,128',
          '2 to 2': '720',
          '1 to 2': '27,504',
          '2 to 3': '27,072',
          '1 to 3': '23,760',
        },
        medium: {
          '1 to 1': '233,712',
          '2 to 2': '1,872',
          '1 to 2': '169,776',
          '2 to 3': '46,368',
          '1 to 3': '164,160',
        },
      },
    },
  },
  'MRI-CGCM3': {
    rcp45: {
      '2010-2039': {
        low: {
          '1 to 1': '588,528',
          '2 to 2': '19,584',
          '1 to 2': '864',
          '2 to 3': '0',
          '1 to 3': '0',
        },
        medium: {
          '1 to 1': '561,888',
          '2 to 2': '31,824',
          '1 to 2': '5,760',
          '2 to 3': '144',
          '1 to 3': '0',
        },
      },
      '2040-2069': {
        low: {
          '1 to 1': '586,512',
          '2 to 2': '20,880',
          '1 to 2': '2,880',
          '2 to 3': '0',
          '1 to 3': '0',
        },
        medium: {
          '1 to 1': '499,536',
          '2 to 2': '32,112',
          '1 to 2': '68,112',
          '2 to 3': '432',
          '1 to 3': '0',
        },
      },
      '2070-2099': {
        low: {
          '1 to 1': '578,736',
          '2 to 2': '23,184',
          '1 to 2': '10,656',
          '2 to 3': '3,744',
          '1 to 3': '0',
        },
        medium: {
          '1 to 1': '500,688',
          '2 to 2': '34,560',
          '1 to 2': '57,888',
          '2 to 3': '8,208',
          '1 to 3': '9,072',
        },
      },
    },
    rcp85: {
      '2010-2039': {
        low: {
          '1 to 1': '587,808',
          '2 to 2': '24,912',
          '1 to 2': '1,584',
          '2 to 3': '0',
          '1 to 3': '0',
        },
        medium: {
          '1 to 1': '562,608',
          '2 to 2': '34,416',
          '1 to 2': '5,040',
          '2 to 3': '144',
          '1 to 3': '0',
        },
      },
      '2040-2069': {
        low: {
          '1 to 1': '576,720',
          '2 to 2': '26,640',
          '1 to 2': '12,672',
          '2 to 3': '288',
          '1 to 3': '0',
        },
        medium: {
          '1 to 1': '525,888',
          '2 to 2': '34,992',
          '1 to 2': '35,712',
          '2 to 3': '5,760',
          '1 to 3': '6,048',
        },
      },
      '2070-2099': {
        low: {
          '1 to 1': '568,944',
          '2 to 2': '12,960',
          '1 to 2': '18,576',
          '2 to 3': '14,832',
          '1 to 3': '1,872',
        },
        medium: {
          '1 to 1': '464,688',
          '2 to 2': '17,856',
          '1 to 2': '77,472',
          '2 to 3': '29,520',
          '1 to 3': '25,488',
        },
      },
    },
  },
}
</script>

<template>
  <section class="section">
    <div class="content clamp is-size-5">
      <h3 class="title is-3">Climate Protection from Spruce Beetles</h3>
      <p class="mb-6"></p>
      <h4>Introduction</h4>
      <p>
        Spruce beetles are small insects that play a significant role in
        Alaska's forests, infesting white spruce, Sitka spruce, and Lutz spruce.
        These outbreaks can cause substantial damage to forest ecosystems and
        have economic repercussions. In recent years the frequency and severity
        of spruce beetle outbreaks in Alaska have increased, prompting
        researchers to delve deeper into understanding the factors influencing
        these outbreaks.
      </p>
      <h4>The Beetle Life Cycle and Climate Connection</h4>
      <p>
        Spruce beetles have a lifecycle closely tied to climate conditions.
        Adult beetles typically fly to new trees in the spring where females
        then lay their eggs. The timing of beetle flight is linked to
        temperature with flight occurring when temperatures reach approximately
        16°C or warmer. Once hatched larvae develop over the summer with some
        maturing into adults by the end of the season. Maturation within a
        single summer season, termed univoltinism, depends on the accumulation
        of heat during the summer months. Beetles that mature in a single summer
        (univoltine) have a higher chance of survival compared to those that
        overwinter as larvae (semivoltine), not only because they can breed
        sooner, but also because over-winter predation of larvae by woodpeckers
        is high. Beetles are also moderated by cold temperatures. Rapid cooling
        during the fall or extreme cold temperatures during winter can limit
        beetle survival. Understanding these climate factors is essential for
        predicting and mitigating outbreaks.
      </p>

      <figure class="image">
        <img src="assets/images/beetle_voltinism.png" />
      </figure>

      <h4>Modeling Spruce Beetle Outbreaks</h4>

      <p>
        To better understand and predict spruce beetle outbreaks, researchers
        developed a comprehensive model that incorporates various climate
        factors and beetle life cycle stages. The model assesses the risk of
        outbreaks across different time periods considering historical climate
        data, climate projections, and beetle population dynamics. By
        calibrating the model with observed outbreak patterns, researchers
        categorized climate protection levels and identified regions that might
        lose past climate-linked protections from outbreaks.
      </p>

      <p>
        Use this interactive widget to explore how climate protection from
        spruce beetle outbreaks changes under different models and model
        parameters for the entire state of Alaska.
      </p>

      <div class="my-6">
        <div>
          <div class="parameter mb-5">
            <label for="model" class="label">Model</label>
            <div class="select mr-3">
              <select id="model" v-model="modelInput">
                <option v-for="model in models" :value="model">
                  {{ model }}
                </option>
              </select>
            </div>
          </div>
          <div class="parameter mb-5">
            <label for="scenario" class="label">Scenario</label>
            <div class="select mr-3">
              <select id="scenario" v-model="scenarioInput">
                <option
                  v-for="scenario in Object.keys(scenarioLabels)"
                  :value="scenario"
                >
                  {{ scenarioLabels[scenario] }}
                </option>
              </select>
            </div>
          </div>
          <div class="parameter mb-5 mr-3">
            <label for="era" class="label">Era</label>
            <div class="select">
              <select id="era" v-model="eraInput">
                <option v-for="era in eras" :value="era">
                  {{ era }}
                </option>
              </select>
            </div>
          </div>
          <div class="parameter">
            <label for="snowpack" class="label">Snowpack</label>
            <div class="select mb-5">
              <select id="snowpack" v-model="snowpackInput">
                <option
                  v-for="snowpack in Object.keys(snowpackLabels)"
                  :value="snowpack"
                >
                  {{ snowpackLabels[snowpack] }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <table class="is-size-5">
          <tr v-for="key in Object.keys(dataLabels)">
            <th>
              {{ dataLabels[key] }}
            </th>
            <td>
              {{
                data[modelInput][scenarioInput][eraInput][snowpackInput][key]
              }}
              km<sup>2</sup>
            </td>
          </tr>
        </table>
      </div>

      <h4>Implications for Forest Management</h4>
      <p>
        Understanding the factors driving spruce beetle outbreaks is essential
        for effective forest management and conservation efforts. By identifying
        areas that may become more vulnerable, forest managers can implement
        proactive measures to mitigate beetle infestations such as targeted tree
        removal, forest thinning, and monitoring programs. These management
        practices can help maintain the health and resilience of Alaska's
        forests in the face of changing climate conditions.
      </p>
      <h4>Conclusion</h4>
      <p>
        Spruce beetle outbreaks pose significant challenges to Alaska's forests,
        but through interdisciplinary research and advanced modeling techniques
        scientists are gaining valuable insights into the complex interactions
        between climate, beetle populations, and forest ecosystems. By applying
        this knowledge stakeholders can work towards sustainable forest
        management practices that help protect Alaska's valuable spruce forests
        for future generations.
      </p>
      <GetAndUseDataBeetle>
        <template #preamble
          ><p>
            See
            <NuxtLink to="/item/climate-beetle-protection"
              >maps and charts of this data here</NuxtLink
            >.
          </p>
        </template>
      </GetAndUseDataBeetle>
    </div>
    <Bios :people="['Nancy Fresco']" />
  </section>
</template>

<style lang="scss" scoped>
.parameter {
  display: inline-block;
  select {
    background-color: $white-lighter;
  }
}

th {
  min-width: 200px;
}
</style>
