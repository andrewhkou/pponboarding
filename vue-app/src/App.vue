<template>
  <div id="app" class="small-container">
    <h1>Students</h1>
    <employee-form @add:employee="addEmployee" />
    <employee-table
      :employees="employees"
      @delete:employee="deleteEmployee"
      @edit:employee="editEmployee"
    />
    <h1>PatientPop Roster</h1>
    <team-editor :employees="employees" @add:employee="editEmployee" />
  </div>
</template>

<script>
import EmployeeTable from "@/components/EmployeeTable.vue";
import EmployeeForm from "@/components/EmployeeForm.vue";
import TeamEditor from "@/components/TeamEditor.vue";

export default {
  name: "app",
  components: {
    EmployeeTable,
    EmployeeForm,
    TeamEditor
  },
  data() {
    return {
      employees: [
        {
          id: 1,
          name: "Parth Shah",
          email: "partyshah@lambdaschool.com",
          year: "Freshman",
          team: "PatientPop"
        },
        {
          id: 2,
          name: "Selina Feng",
          email: "selinafeng@berkeley.edu",
          year: "Junior",
          team: ""
        },
        {
          id: 3,
          name: "Michael Chen",
          email: "michaelchen@berkeley.edu",
          year: "Sophomore",
          team: ""
        }
      ]
    };
  },
  methods: {
    addEmployee(employee) {
      const lastId =
        this.employees.length > 0
          ? this.employees[this.employees.length - 1].id
          : 0;
      const id = lastId + 1;
      const newEmployee = { ...employee, id };

      this.employees = [...this.employees, newEmployee];
    },
    async editEmployee(id, updatedEmployee) {
      this.employees = this.employees.map(employee =>
        employee.id === id ? updatedEmployee : employee
      );
    },
    async deleteEmployee(id) {
      try {
        await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
          method: "DELETE"
        });
        this.employees = this.employees.filter(employee => employee.id !== id);
      } catch (error) {
        console.error(error);
      }
    }
  }
};
</script>

<style>
button {
  background: #009435;
  border: 1px solid #009435;
}

.small-container {
  max-width: 680px;
}
</style>
