export interface CuspSourceCitation {
  entryType: string
  author?: string
  year?: string
  title?: string
  publisher?: string
  institution?: string
  journal?: string
  volume?: string
  number?: string
  pages?: string
  doi?: string
  url?: string
  version?: string
  note?: string
  howpublished?: string
}

const cuspSources: Record<string, CuspSourceCitation> = {
  Bakian_Dogaheh_2020: {
    entryType: 'misc',
    author:
      'Bakian-Dogaheh, K., Chen, R. H., Moghaddam, M., Yi, Y., & Tabatabaeenejad, A. (2020). ABoVE',
    year: '2018',
    title:
      'Active Layer Soil Characterization of Permafrost Sites, Northern Alaska, 2018 (Version 1)',
    publisher: 'ORNL Distributed Active Archive Center',
    version: '1',
  },
  Bonaventure_Whati: {
    entryType: 'misc',
    author:
      'Bonaventure, P., unpublished observation of permafrost occurrence around Whati, Northwest Territories, Canada',
    year: '2019',
    howpublished:
      ', unpublished observation of permafrost occurrence around Whati, Northwest Territories, Canada, 2019',
  },
  Brown_etal_2000_calm: {
    entryType: 'article',
    author:
      'Brown, J., K. Muc Hinkel, and F. E. Nelson. "The circumpolar active layer monitoring (CALM) program',
    year: '2000',
    title: 'research designs and initial results',
    journal: 'Polar geography',
    volume: '3',
    number: '2000',
    pages: '166-258',
  },
  Cable_2017: {
    entryType: 'dataset',
    author: 'William Cable & Vladimir Romanovsky',
    year: '2017',
    title: 'Network of Permafrost Observatories in Western Alaska',
    publisher: 'Arctic Data Center',
    doi: '10.18739/A23N20D37',
  },
  Chapin_2025: {
    entryType: 'dataset',
    author:
      'Chapin, F.S., R. Ruess, and Bonanza Creek LTER. 2025. Bonanza Creek LTER',
    year: '2004',
    title:
      'Annual Active Layer Depths from 2004 to Present in the Boundary Fire Fireline near Fairbanks, Alaska ver 27',
    publisher: 'Environmental Data Initiative',
    institution: 'Bonanza Creek LTER',
    version: '27.',
  },
  Daanen_2017: {
    entryType: 'dataset',
    author: 'Ronald Daanen',
    year: '2017',
    title:
      'Elevation and permafrost active layer observations near two creeks in the foothills of the Brooks Range, Alaska, May 2017',
    publisher: 'Arctic Data Center',
    doi: '10.18739/A2H708100',
  },
  Douglas_Koyukuk_2022: {
    entryType: 'dataset',
    author:
      'Douglas M ; Blankenship R ; Chadwick A ; Dunne K ; Fischer W ; Geyman E ; Ke Y ; Kemeny P ; Li G ; Magyar J ; Mutter E ; Nghiem J ; Piliouras A ; Reahl J ; Rowland J ; Schwenk J ; Seelen E ; Smith M I ; West A J ; Lamb M',
    year: '2023',
    title:
      'Geomorphic mapping and permafrost occurrence on the Koyukuk River floodplain near Huslia, Alaska',
    publisher: 'ESS-DIVE',
    version: 'floodplain',
    doi: '10.15485/2204419',
  },
  Ebel_2018: {
    entryType: 'dataset',
    author:
      'Ebel, B.A., 2018, Physical and hydraulic properties at recently burned and long-unburned boreal forest areas in interior Alaska, USA',
    year: '2018',
    title:
      'Physical and hydraulic properties at recently burned and long-unburned boreal forest areas in interior Alaska, USA',
    institution: 'U.S. Geological Survey',
  },
  Hanston_etal_2024: {
    entryType: 'dataset',
    author: 'Hanston W ; Yang D ; Hayes D ; Serbin S',
    year: '2024',
    title:
      'Thaw depth, soil moisture, and vegetation height, Teller and Kougarok sites, Seward Peninsula, Alaska, 2022',
    publisher: 'ESS-DIVE',
  },
  Hollingsworth_2005: {
    entryType: 'misc',
    author: 'Hollingsworth, Teresa Nettleton',
    year: '2005',
    title:
      'Active layer depths: 150 mature black spruce sites in interior Alaska (2000-2003), Bonanza Creek LTER - University of Alaska Fairbanks',
    institution: 'Bonanza Creek LTER',
    doi: '10.6073/pasta/2fbece708e6552adb8ba6dcbc817ebb1',
    url: 'http://www.lter.uaf.edu/data/data-detail/id/140',
  },
  Holloway_2019: {
    entryType: 'article',
    author: 'Jean E. Holloway & Antoni G. Lewkowicz',
    year: '2020',
    title:
      'Half a century of discontinuous permafrost persistence and degradation in western Canada," Permafrost and Periglacial Processes, John Wiley & Sons, vol',
    journal: 'Permafrost and Periglacial Processes',
  },
  Jafarov_2016: {
    entryType: 'dataset',
    author:
      'Jafarov, E., A. Parsekian, K. Schaefer, L. Liu, A. Chen, S.K. Panda, and T. Zhang. 2018. Pre-ABoVE',
    year: '2013',
    title:
      'Active Layer Thickness and Soil Water Content, Barrow, Alaska, 2013',
    publisher: 'ORNL DAAC',
  },
  James_2019: {
    entryType: 'dataset',
    author:
      'James, S.R., Minsley, B.J., Waldrop, M.P., McFarland, J.W., Manies, K.L., and Pastick, N.J., 2021, Permafrost characterization at the Alaska Peatland Experiment (APEX)',
    year: '2020',
    title:
      'Permafrost characterization at the Alaska Peatland Experiment (APEX): Geophysical and related field data collected from 2018-2020',
    institution: 'U.S. Geological Survey',
  },
  James_2020: {
    entryType: 'dataset',
    author:
      'James, S.R., Minsley, B.J., Pastick, N.J., and Sullivan, T.D., 2020, Alaska permafrost characterization',
    year: '2020',
    title:
      'Alaska permafrost characterization: Geophysical and related field data collected from 2019-2020',
    institution: 'U.S. Geological Survey',
  },
  Jones_2025: {
    entryType: 'dataset',
    author:
      'Benjamin Jones, Mikhail Kanevskiy, Melissa Ward Jones, Phillip Wilson, Isaiah Ditmer, Benjamin Gaglioti, Eric Klein, Rodrigo Rangel, Kristi Wallace, Miriam Jones, Matthew Wooller, & Yuri Shur',
    year: '2025',
    title:
      'Near-surface permafrost studies near Bethel and remotely sensing ice wedge networks across the Yukon Kuskokwim Delta, Alaska 2025',
    publisher: 'Arctic Data Center',
    doi: '10.18739/A24B2X68B',
  },
  Jones_Jones_2025: {
    entryType: 'dataset',
    author: 'Melissa Ward Jones, & Benjamin Jones',
    year: '2025',
    title:
      'Permafrost and Environmental Monitoring in 2023 and 2024 at the Teshekpuk Lake Observatory, Northern Alaska',
    publisher: 'Arctic Data Center',
    doi: '10.18739/A29Z90D9R',
  },
  Jorgenson_Kanevskiy_2022_Gosling: {
    entryType: 'dataset',
    author: 'Mark Jorgenson, & Mikhail Kanevskiy',
    year: '2022',
    title:
      'Gosling Lake, Alaska, Topography, Vegetation, Soils, Soil temperatures, and Site-Environmental Data, 2005-2021',
    publisher: 'Arctic Data Center',
    doi: '10.18739/A22F7JS4S',
  },
  Jorgenson_Kanevskiy_2022_Jago: {
    entryType: 'dataset',
    author: 'Mark Jorgenson, & Mikhail Kanevskiy',
    year: '2022',
    title:
      'Jago Alaska Topography, Vegetation, Soils, and Site-Environmental Data 2009-2018',
    publisher: 'Arctic Data Center',
    doi: '10.18739/A2XP6V496',
  },
  Jorgenson_Kanevskiy_2025: {
    entryType: 'dataset',
    author: 'Mark Jorgenson, & Mikhail Kanevskiy',
    year: '2025',
    title:
      'Alaska Permafrost Soils Inventory and Thermokarst Monitoring Database 2024 Update',
    publisher: 'Arctic Data Center',
    doi: '10.18739/A27P8TG0G',
  },
  Kling_2016: {
    entryType: 'dataset',
    author: 'Kling, G',
    year: '2016',
    title:
      'Tussock Watershed Thaw Depth Survey Summary for 1990 to present, Arctic LTER, Toolik Research Station, Alaska',
    publisher: 'Environmental Data Initiative',
    institution: 'Arctic LTER',
    version: '9.',
  },
  Kling_2025: {
    entryType: 'dataset',
    author: 'Kling, G',
    year: '2025',
    title:
      'Imnavait Watershed Thaw Depth Survey Summary for 2003 to 2024, Arctic LTER, Toolik Research Station, Alaska',
    publisher: 'Environmental Data Initiative',
    institution: 'Arctic LTER',
    version: '13.',
    doi: '10.6073/pasta/6ed482c5c7dd3fd5871b2e463734ce75',
    url: 'https://doi.org/10.6073/pasta/6ed482c5c7dd3fd5871b2e463734ce75',
    note: 'Accessed 2025-07-30',
  },
  Koyukuk_2018: {
    entryType: 'dataset',
    author: 'Schwenk J ; Piliouras A ; Rowland J',
    year: '2023',
    title:
      'Observations and Machine-Learned Models of Near-Surface Permafrost along the Koyukuk River, Alaska, USA',
    publisher: 'ESS-DIVE',
    doi: '10.15485/1922517',
  },
  Langer_etal_2020: {
    entryType: 'dataset',
    author:
      'Langer, Moritz; Kaiser, Soraya; Oehme, Alexander; Schneider von Deimling, Thomas; Jacobi, Stephan (2020)',
    year: '2019',
    title:
      'Active layer thickness (ALT) on the North Slope of Alaska (USA) and Manitoba (Canada) in summer 2018 and 2019 [dataset]',
    publisher: 'PANGAEA',
  },
  Minsley_2015: {
    entryType: 'dataset',
    author:
      'Pastick, N.J., Kass, M.A., Wylie, B.K., James, S.R., Rey, D.M., Minsley, B.J., and Ebel, B.A., 2018, Alaska permafrost characterization',
    year: '2017',
    title:
      'Alaska permafrost characterization: Geophysical and related field data collected from 2016-2017',
    institution: 'U.S. Geological Survey',
  },
  Minsley_2017: {
    entryType: 'dataset',
    author:
      'Pastick, N.J., Kass, M.A., Wylie, B.K., James, S.R., Rey, D.M., Minsley, B.J., and Ebel, B.A., 2018, Alaska permafrost characterization',
    year: '2017',
    title:
      'Alaska permafrost characterization: Geophysical and related field data collected from 2016-2017',
    institution: 'U.S. Geological Survey',
  },
  Minsley_2021: {
    entryType: 'dataset',
    author:
      'Minsley, B.J., James, S.R., and Pastick, N.J., 2022, Alaska permafrost characterization',
    year: '2021',
    title:
      'Alaska permafrost characterization: Geophysical and related field data collected in 2021',
    institution: 'U.S. Geological Survey',
  },
  Moore_et_al_2025: {
    entryType: 'dataset',
    author:
      'Moore, M.A., K. Schaefer, L.K. Clayton, E.E. Hoy, M. Auclair, K. Bakian-Dogaheh, M.J. Battaglia, K. Bennett, W.R. Bolton, L.L. Bourgeau-Chavez, A.E. Bredder, D. Chen, R.H. Chen, A.C. Chen, J. Chen, D. Chiasson, R. Chitra-tarak, A. Collins, L. Cornette, J. Dann, E. Devoie, M. Dominico, T.A. Douglas, S. Gagnon, S.E. Grelick, P. Griffith, J. He, G. Iwahana, E. Jafarov, L.K. Jenkins, E.S. Kasischke, S. Kim, P.B. Kirchner, B. Lecavalier, J. Ledman, S. Liben, L. Liu, T.V. Loboda, S. Ludwig, M.J. Macander, N. Matsui, R.J. Michaelides, M. Moghaddam, S. Natali, S.K. Panda, M. Pearce, W. Quinton, A.V. Rocha, H. Rodenhizer, P. Roy-LÃ©veillÃ©e, N. Saravanan, Z. Sauve, S.R. Schaefer, E.A.G. Schuur, O. Sonnentag, T.D. Sullivan, A. Tabatabaeenejad, L. Thomas, B. Thorne, K. Turner, K. Wang, C.J. Wilson, H.A. Zebker, T. Zhang, Y. Zhao, and S. Zwieback. 2025. ABoVE',
    year: '2022',
    title:
      'Soil Moisture and Active Layer Thickness in Alaska, USA and Canada, 2005-2022',
    publisher: 'ORNL DAAC',
  },
  Myers_Smith_2005: {
    entryType: 'misc',
    author: 'Myers-Smith, Isla',
    year: '2005',
    title:
      'Active Layer Depth Data for the BBC collapse scar for 2003 and 2004, Bonanza Creek LTER - University of Alaska Fairbanks',
    institution: 'Bonanza Creek LTER',
    doi: '10.6073/pasta/28920b92a1ca20a1a7e90fff842f3e45',
    url: 'http://www.lter.uaf.edu/data/data-detail/id/206',
  },
  Natali_2023: {
    entryType: 'dataset',
    author: 'Natali, S., Ludwig, S., Minions, C., & Watts, J. D. (2023). ABoVE',
    year: '2025',
    title:
      'Thaw Depth at Selected Unburned and Burned Sites Across Alaska (Version 1',
    publisher: 'ORNL Distributed Active Archive Center',
    version: '1.0',
    doi: '10.3334/ORNLDAAC/1579',
    url: 'https://doi.org/10.3334/ORNLDAAC/1579',
    note: 'Date Accessed 2025-10-27',
  },
  Obu_etal_2016: {
    entryType: 'dataset',
    author:
      'Obu, Jaroslav; Lantuit, Hugues; Myers-Smith, Isla H; Heim, Birgit; Wolter, Juliane; Fritz, Michael (2016)',
    year: '2016',
    title:
      'Permafrost cores and active layer pits on Herschel Island: core attributes [dataset]',
    publisher: 'PANGAEA',
    institution: 'lter',
  },
  Pastick: {
    entryType: 'misc',
    howpublished: 'Pastick, Neal, unpublished data various sources',
  },
  Patton_2021: {
    entryType: 'article',
    author:
      'Patton, A. I., Rathburn, S. L., Capps, D. M., McGrath, D., & Brown, R. A',
    year: '2021',
    title: 'Ongoing landslide deformation in thawing permafrost',
    journal: 'Geophysical Research Letters',
  },
  Peirce_2020: {
    entryType: 'dataset',
    author:
      'Jana Peirce, Donald A (Skip) Walker, Emily Watson-Cook, Mikhail Kanevskiy, & Helena Bergstedt',
    year: '2022',
    title:
      'Observations in ice-rich permafrost systems, Prudhoe Bay Alaska, August 2020',
    publisher: 'Arctic Data Center',
    doi: '10.18739/A2542J96D',
  },
  Petrone_etal_2016: {
    entryType: 'dataset',
    author:
      'Petrone, Johannes; Sohlenius, Gustav; Johansson, Emma; Lindborg, Tobias; Näslund, Jens-Ove; Strömgren, Mårten; Brydsten, Lars (2016)',
    year: '2016',
    title:
      'Using ground-penetrating radar, topography and classification of vegetation to model the sediment and active layer thickness in a periglacial lake catchment, Western Greenland, link to shapefiles [dataset]',
    publisher: 'PANGAEA',
  },
  Ruess_2025: {
    entryType: 'misc',
    author: 'Roger Ruess, Teresa Nettleton Hollingsworth, & Bonanza Creek LTER',
    year: '2025',
    title:
      'Bonanza Creek LTER: Active Layer Depth or Permafrost Presence for the Regional Site Network',
    institution: 'Bonanza Creek LTER',
    doi: '10.6073/pasta/10324bd31b26ef97fe2cfe6a8537d941',
    url: 'https://pasta.lternet.edu/package/metadata/eml/knb-lter-bnz/605/6',
  },
  Sadeghi_etal_2023: {
    entryType: 'dataset',
    author: 'Sadeghi Chorsi, Taha',
    year: '2023',
    title:
      'Activer Layer Thickness Estimation using InSAR, Meteorologiical data and Soil parameters',
    publisher: 'Zenodo',
    version: 'Layer',
  },
  Scheer_etal_2023: {
    entryType: 'dataset',
    author:
      'Scheer, Johanna; Caduff, Rafael; How, Penelope; Marcer, Marco; Strozzi, Tazio; Bartsch, Annett; Ingeman-Nielsen, Thomas (2024)',
    year: '2024',
    title:
      'Mapping the frost susceptibility of the ground from thaw-season InSAR surface displacements and extrapolated active layer thicknesses, Ilulissat, West-Greenland [dataset]',
    publisher: 'PANGAEA',
  },
  Schwenk_PFRR: {
    entryType: 'misc',
    author: 'Schwenk, Jon',
    year: '2024',
    title: 'Poker Flats Research Range observations, unpublished',
    howpublished:
      '(2024), Poker Flats Research Range observations, unpublished',
  },
  Selawik: {
    entryType: 'misc',
    author: 'Rowland, Joel',
    year: '2022',
    title: 'Selawik National Wildlife Refuge observations, unpublished',
    howpublished:
      '(2022), Selawik National Wildlife Refuge observations, unpublished',
  },
  Seward: {
    entryType: 'dataset',
    author:
      'Thaler E ; Uhlemann S ; Rowland J ; Dafflon B ; Schwenk J ; Bennett K ; Thomas L',
    year: '2023',
    title:
      'Machine learning predictions of near-surface permafrost extent at Teller 27, Teller 47, and the Kougarok 64 Hillslope sites on the Seward Peninsula, Alaska: Supporting Data',
    publisher: 'ESS-DIVE',
    doi: '10.5440/1970774',
  },
  Seward_2022: {
    entryType: 'dataset',
    author: 'Thaler E ; Del Vecchio J ; Farley M ; Thomas L ; Rowland J',
    year: '2024',
    title:
      'Active Layer Depth and Permafrost Temperatures at the Teller 47 Field Site, Seward Peninsula, Alaska, 2022',
    publisher: 'ESS-DIVE',
    doi: '10.15485/2395957',
  },
  Smith_Burgess_2000: {
    entryType: 'techreport',
    author: 'Smith, S. & Burgess, M. M',
    year: '2000',
    title: 'Ground temperature database for northern Canada',
    institution: 'Geological Survey of Canada',
    volume: '3954',
    pages: '28',
  },
  Smith_Burgess_2002: {
    entryType: 'techreport',
    author: 'Smith, S. L. & Burgess, M. M',
    year: '2002',
    title: 'A digital database of permafrost thickness in Canada',
    institution: 'Geological Survey of Canada',
    volume: '4173',
    pages: '38',
  },
  Talucci_2024: {
    entryType: 'dataset',
    author:
      "Anna Talucci, Michael Loranty, Jean Holloway, Brendan Rogers, Heather Alexander, Natalie Baillargeon, Jennifer Baltzer, Logan Berner, Amy Breen, Leya Brodt, Brian Buma, Clement Delcourt, Lucas Diaz, Catherine Dieleman, Thomas Douglas, Gerald Frost, Benjamin Gaglioti, Rebecca Hewitt, Teresa Hollingsworth, M. Torre Jorgenson, Mark Lara, Rachel Loehman, Michelle Mack, Kristen Manies, Christina Minions, Susan Natali, Jonathon O'Donnell, David Olefeldt, Alison Paulson, Adrian Rocha, Lisa Saperstein, Tatiana Shestakova, Oleg Sizov, Andrey Soromotin, Merritt Turetsky, Sander Veraverbeke, & Michelle Walvoord. (2024). FireALT dataset",
    year: '2023',
    title:
      'estimated active layer thickness for paired burned unburned sites measured from 2001-2023',
    publisher: 'Arctic Data Center',
    doi: '10.18739/A2W950Q33',
  },
  Wagner_2019: {
    entryType: 'misc',
    author: 'Wagner, Anna; Barker, Amanda (2018), “Data for',
    year: '2018',
    title:
      'Distribution of Polycyclic Aromatic Hydrocarbons (PAHs) from Legacy Spills at an Alaskan Arctic Site Underlain by Permafrost”, Mendeley Data, V1',
    doi: '10.17632/2dn4rdmsxn.1',
  },
  Walker_2022: {
    entryType: 'dataset',
    author:
      'Donald A (Skip) Walker, Emily Watson-Cook, Mikhail Kanevskiy, & Helena Bergstedt',
    year: '2022',
    title:
      'Observations in ice-rich permafrost systems, Prudhoe Bay Alaska, August 2020',
    publisher: 'Arctic Data Center',
    doi: '10.18739/A2445HF16',
  },
  Wang_2018: {
    entryType: 'dataset',
    author:
      'Kang Wang, Irina Overeem, Elchin Jafarov, Gary Clow, Vladimir Romanovsky, Kevin Schaefer, Frank Urban, William Cable, Mark Piper, Christopher Schwalm, Tingjun Zhang, Alexander Kholodov, Pamela Sousanes, Michael Loso, David Swanson, & Kenneth Hill',
    year: '2018',
    title:
      'A synthesis dataset of near-surface permafrost conditions for Alaska, 1997-2016',
    publisher: 'Arctic Data Center',
    doi: '10.18739/A24X54G8D',
  },
  Whitley_2018: {
    entryType: 'dataset',
    author:
      'Whitley, M., G. Frost, M.T. Jorgenson, M. Macander, C.V. Maio, and S.G. Winder. 2018. ABoVE',
    year: '2016',
    title:
      'Permafrost Measurements and Distribution Across the Y-K Delta, Alaska, 2016',
    publisher: 'ORNL DAAC',
  },
  Zhang_2019: {
    entryType: 'misc',
    author:
      'Zhang Y, Touzi R, Feng W, Hong G, Lantz TC, Kokelj SV. Landscape-scale variations in near-surface soil temperature and active-layer thickness',
    year: '2021',
    title: 'Implications for high-resolution permafrost mapping',
    volume: '32',
    number: '4',
    pages: '627-640',
  },
  Zhao_2021: {
    entryType: 'dataset',
    author:
      'Zhao, L., Zou, D., Hu, G., Wu, T., Du, E., Liu, G., Xiao, Y., Li, R., Pang, Q., Qiao, Y., Wu, X., Wang, L., Wang, C., and Cheng, G.',
    year: '2021',
    title:
      'A synthesis dataset of permafrost thermal state for the Qinghai–Tibet (Xizang) Plateau, China',
    journal: 'Earth Syst. Sci. Data',
    volume: '13',
    pages: '4207–4218',
    doi: '10.5194/essd-13-4207-2021',
    url: 'https://doi.org/10.5194/essd-13-4207-2021',
  },
}

export default cuspSources
