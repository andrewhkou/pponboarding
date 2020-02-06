<template>
  <div id="team-list">
    <table>
      <thead>
        <tr>
          <th>Members</th>
        </tr>
      </thead>
      <tbody>
        <tr :key="employee.id" v-for="employee in patientPopMembers">
          <td>{{employee.name}}</td>
              <button @click="removeMember(employee)">Remove Member</button>
        </tr>
      </tbody>
    </table>
    <div>
      <select v-model="newMember">
        <option
          v-for="employee in notPatientPopMembers"
          v-bind:key="employee.id"
          v-bind:value="employee"
        >{{ employee.name }}</option>
      </select>
      <button @click="addMember(newMember)">Add Member</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "team-editor",
  props: {
    employees: Array
  },
  computed: {
    patientPopMembers: function() {
      return this.employees.filter(function(u) {
        return u.team === "PatientPop";
      });
    },
    notPatientPopMembers: function() {
      return this.employees.filter(function(u) {
        return u.team !== "PatientPop";
      });
    }
  },
  data() {
    return {
      adding: false
    };
  },
  methods: {
    addMember(employee) {
      employee.team = "PatientPop";
      this.$emit("add:employee", employee.id, employee);
      this.adding = false;
    },
    removeMember(employee) {
        employee.team = "";
        this.$emit("add:employee", employee.id, employee);
        this.adding = false;
    }
  }
};
</script>

<style scoped>
</style>