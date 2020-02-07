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
      employees: []
    };
  },
  mounted() {
    this.getEmployees();
  },
  methods: {
    async addEmployee(employee) {
      try {
        const response = await fetch(
          "https://xh387a68z1.execute-api.us-east-1.amazonaws.com/dev/employee",
          {
            method: "POST",
            body: JSON.stringify(employee)
          }
        );
        const data = await response.json();
        const newEmployee = { ...employee, id: data["employeeId"] };
        this.employees = [...this.employees, newEmployee];
        console.log(this.employees);
      } catch (error) {
        console.error(error);
      }
    },
    async editEmployee(id, updatedEmployee) {
      this.employees = this.employees.map(employee =>
        employee.id === id ? updatedEmployee : employee
      );
    },
    async getEmployees() {
      try {
        const response = await fetch(
          "https://xh387a68z1.execute-api.us-east-1.amazonaws.com/dev/employee"
        );
        const data = await response.json();
        this.employees = data["employees"];
      } catch (error) {
        console.error(error);
      }
    },

    async deleteEmployee(id) {
      try {
        await fetch(`https://xh387a68z1.execute-api.us-east-1.amazonaws.com/dev/employee/${id}`, {
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
