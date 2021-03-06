const knex = require('./knex');

module.exports = {
  // PROPERTY DOCUMENTS
  getDocuments: id => {
    return knex('documents').where('property_id', id);
  },

  createDocument: document => {
    return knex('documents').insert(document);
  },

  updateDocument: (document) => {
    return knex('documents').where('id', document.id)
      .update({
        title: document.title,
        document_url: document.document_url
      });
  },

  deleteDocument: (document) => {
    return knex('documents').where('id', document.id).del();
  },

  // PROPERTY MAINTENANCE
  getMaintenance: id => {
    return knex('maintenance').where('property_id', id);
  },

  createMaintenance: maintenance => {
    return knex('maintenance').insert(maintenance);
  },

  updateMaintenance: (maintenance) => {
    return knex('maintenance').where('id', maintenance.id)
      .update({
        title: maintenance.title,
        request: maintenance.request,
        status: maintenance.status
      });
  },

  deleteMaintenance: maintenance => {
    return knex('maintenance').where('id', maintenance.id).del();
  },

  // PROPERTY
  getPropertyInfo: id => {
    return knex.select('*', 'property.id as property_id').from('property').where('property.id', id)
      .join('location', 'location_id', 'location.id')
  },
  createNewProperty: property => {
    const {
      location,
      address,
      rent_price,
      bedrooms,
      bathrooms,
      square_footage,
      image,
      landlord_id
    } = property
    return knex('location').where('city', location.city)
      .andWhere('state', location.state)
      .andWhere('zip_code', location.zip_code)
      .first()
      .then(if_found => {
        if (if_found) {
          const location_id = if_found.id;
          return location_id;
        } else {
          return knex('location').insert(location)
            .then(new_location => {
              const createdLocation = new_location[0];
              const location_id = createdLocation.id;
              return location_id;
            })
        }
      }).then(location_id => {
        return knex('property').insert({
          address,
          rent_price,
          bedrooms,
          bathrooms,
          square_footage,
          image,
          landlord_id,
          location_id: location_id
        })
      })
  },
  updateProperty: property => {
    const {
      location,
      address,
      rent_price,
      bedrooms,
      bathrooms,
      square_footage,
      image,
      landlord_id
    } = property
    return knex('location').where('city', location.city)
      .andWhere('state', location.state)
      .andWhere('zip_code', location.zip_code)
      .first()
      .then(if_found => {
        if (if_found) {
          console.log(if_found);
          const location_id = if_found.id;
          return location_id;
        } else {
          return knex('location').insert(location)
            .then(new_location => {
              const createdLocation = new_location[0];
              const location_id = createdLocation.id;
              return location_id;
            })
        }
      }).then(location_id => {
        console.log(location_id, address);
        return knex('property').where('id', property.id)
          .update({
            address,
            rent_price,
            bedrooms,
            bathrooms,
            square_footage,
            image,
            location_id: location_id
          })
      })
  },
  deleteProperty: id => {
    return knex('property').where('id', id).del();
  },
  getAllTenatsByProperty: (id) => {
    return knex.select('first_name', 'last_name', 'email','tenant_property.id').from('property').where('property_id', id)
      .join('tenant_property', 'property_id', 'property.id')
      .join('account', 'tenant_id', 'account.id')
  },

  addTenant: tenant => {
    const {
      property_id,
      email
    } = tenant;
    return knex.select('*').from('account').where('email', email)
    .first()
    .then(user => {
      return knex('tenant_property').insert({
        tenant_id: user.id,
        property_id
      })
      console.log(user.id);
    });
  },

  deleteTenant: tenant => {
    const {
      id,
      property_id
    } = tenant;

    return knex('tenant_property')
      .where('tenant_property.id', id).del();
  }
}
