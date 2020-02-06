<template>
  <div id="team-list">
    <table>
      <thead>
        <tr>
          <th>Members</th>
        </tr>
      </thead>
      <tbody>
        <tr :key="employee.id" v-for="employee in employees">
          <td v-if="employee.team === 'PatientPop'">{{employee.name}}</td>
        </tr>
        <tr v-if="adding">
          <select v-model="employee" @change="addMember(employee)">
            <option v-for="employee in employees" v-bind:key="employee">{{ employee.name }}</option>
          </select>
        </tr>
        <tr v-else>
          <button @click="addMode()">Add Team Member</button>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "team-editor",
  props: {
    employees: Array
  },
  data() {
    return {
      adding: false
    };
  },
  methods: {
    addMode() {
      this.adding = true;
    },
    addMember(employee) {
        console.log(employee);
      if (this.member === "") {
          console.log("canceled");
          return;
      }
      this.$emit("edit:employee", employee.id, employee);
      this.adding = null;
    }
  }
};
</script>

<style scoped>
</style>