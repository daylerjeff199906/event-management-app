// data/ubigeo.ts
export interface Location {
  id: string;
  name: string;
  parentId?: string; // Referencia al nivel superior
}

export interface PeruLocations {
  departments: Location[];
  provinces: Location[];
  districts: Location[];
}

export const PERU_LOCATIONS: PeruLocations = {
  departments: [
    { id: '16', name: 'Loreto' }
  ],

  provinces: [
    // Departamento: Loreto (16)
    { id: '1601', name: 'Maynas', parentId: '16' },
    { id: '1602', name: 'Alto Amazonas', parentId: '16' },
    { id: '1603', name: 'Loreto', parentId: '16' },
    { id: '1604', name: 'Mariscal Ramón Castilla', parentId: '16' },
    { id: '1605', name: 'Requena', parentId: '16' },
    { id: '1606', name: 'Ucayali', parentId: '16' },
    { id: '1607', name: 'Datem del Marañón', parentId: '16' },
    { id: '1608', name: 'Putumayo', parentId: '16' }
  ],

  districts: [
    // Provincia: MAYNAS (1601)
    { id: '160101', name: 'Iquitos', parentId: '1601' },
    { id: '160102', name: 'Alto Nanay', parentId: '1601' },
    { id: '160103', name: 'Fernando Lores', parentId: '1601' },
    { id: '160104', name: 'Indiana', parentId: '1601' },
    { id: '160105', name: 'Las Amazonas', parentId: '1601' },
    { id: '160106', name: 'Mazán', parentId: '1601' },
    { id: '160107', name: 'Napo', parentId: '1601' },
    { id: '160108', name: 'Punchana', parentId: '1601' },
    { id: '160110', name: 'Belén', parentId: '1601' },
    { id: '160112', name: 'San Juan Bautista', parentId: '1601' },
    { id: '160113', name: 'Torres Causana', parentId: '1601' },

    // Provincia: ALTO AMAZONAS (1602)
    { id: '160201', name: 'Yurimaguas', parentId: '1602' },
    { id: '160202', name: 'Balsapuerto', parentId: '1602' },
    { id: '160205', name: 'Jeberos', parentId: '1602' },
    { id: '160206', name: 'Lagunas', parentId: '1602' },
    { id: '160210', name: 'Santa Cruz', parentId: '1602' },
    { id: '160211', name: 'Teniente César López Rojas', parentId: '1602' },

    // Provincia: LORETO (1603)
    { id: '160301', name: 'Nauta', parentId: '1603' },
    { id: '160302', name: 'Parinari', parentId: '1603' },
    { id: '160303', name: 'Tigre', parentId: '1603' },
    { id: '160304', name: 'Trompeteros', parentId: '1603' },
    { id: '160305', name: 'Urarinas', parentId: '1603' },

    // Provincia: MARISCAL RAMÓN CASTILLA (1604)
    { id: '160401', name: 'Ramón Castilla', parentId: '1604' },
    { id: '160402', name: 'Pebas', parentId: '1604' },
    { id: '160403', name: 'Yavari', parentId: '1604' },
    { id: '160404', name: 'San Pablo', parentId: '1604' },

    // Provincia: REQUENA (1605)
    { id: '160501', name: 'Requena', parentId: '1605' },
    { id: '160502', name: 'Alto Tapiche', parentId: '1605' },
    { id: '160503', name: 'Capelo', parentId: '1605' },
    { id: '160504', name: 'Emilio San Martín', parentId: '1605' },
    { id: '160505', name: 'Maquía', parentId: '1605' },
    { id: '160506', name: 'Puinahua', parentId: '1605' },
    { id: '160507', name: 'Saquena', parentId: '1605' },
    { id: '160508', name: 'Soplin', parentId: '1605' },
    { id: '160509', name: 'Tapiche', parentId: '1605' },
    { id: '160510', name: 'Jenaro Herrera', parentId: '1605' },
    { id: '160511', name: 'Yaquerana', parentId: '1605' },

    // Provincia: UCAYALI (1606)
    { id: '160601', name: 'Contamana', parentId: '1606' },
    { id: '160602', name: 'Inahuaya', parentId: '1606' },
    { id: '160603', name: 'Padre Márquez', parentId: '1606' },
    { id: '160604', name: 'Pampa Hermosa', parentId: '1606' },
    { id: '160605', name: 'Sarayacu', parentId: '1606' },
    { id: '160606', name: 'Vargas Guerra', parentId: '1606' },

    // Provincia: DATEM DEL MARAÑÓN (1607)
    { id: '160701', name: 'San Lorenzo', parentId: '1607' },
    { id: '160702', name: 'Barranca', parentId: '1607' },
    { id: '160703', name: 'Cahuapanas', parentId: '1607' },
    { id: '160704', name: 'Manseriche', parentId: '1607' },
    { id: '160705', name: 'Morona', parentId: '1607' },
    { id: '160706', name: 'Pastaza', parentId: '1607' },

    // Provincia: PUTUMAYO (1608)
    { id: '160801', name: 'Putumayo', parentId: '1608' },
    { id: '160802', name: 'Rosa Panduro', parentId: '1608' },
    { id: '160803', name: 'Teniente Manuel Clavero', parentId: '1608' },
    { id: '160804', name: 'Yaguas', parentId: '1608' }
  ]
};

// Funciones helper para facilitar el acceso
export const ubigeoUtils = {
  // Obtener provincias por departamento
  getProvincesByDepartment: (departmentId: string): Location[] => {
    return PERU_LOCATIONS.provinces.filter(province => province.parentId === departmentId);
  },

  // Obtener distritos por provincia
  getDistrictsByProvince: (provinceId: string): Location[] => {
    return PERU_LOCATIONS.districts.filter(district => district.parentId === provinceId);
  },

  // Obtener distritos por departamento
  getDistrictsByDepartment: (departmentId: string): Location[] => {
    const provinceIds = PERU_LOCATIONS.provinces
      .filter(province => province.parentId === departmentId)
      .map(province => province.id);
    
    return PERU_LOCATIONS.districts.filter(district => 
      provinceIds.includes(district.parentId || '')
    );
  },

  // Obtener ubicación completa por ID
  getLocationById: (id: string): { department?: Location, province?: Location, district?: Location } => {
    if (id.length === 2) {
      const department = PERU_LOCATIONS.departments.find(d => d.id === id);
      return { department };
    } else if (id.length === 4) {
      const province = PERU_LOCATIONS.provinces.find(p => p.id === id);
      const department = province ? PERU_LOCATIONS.departments.find(d => d.id === province.parentId) : undefined;
      return { department, province };
    } else if (id.length === 6) {
      const district = PERU_LOCATIONS.districts.find(d => d.id === id);
      const province = district ? PERU_LOCATIONS.provinces.find(p => p.id === district.parentId) : undefined;
      const department = province ? PERU_LOCATIONS.departments.find(d => d.id === province.parentId) : undefined;
      return { department, province, district };
    }
    return {};
  }
};