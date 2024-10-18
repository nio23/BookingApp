using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class AppuserAppointmentRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "appUserId",
                table: "Appointments",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_appUserId",
                table: "Appointments",
                column: "appUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_AspNetUsers_appUserId",
                table: "Appointments",
                column: "appUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_AspNetUsers_appUserId",
                table: "Appointments");

            migrationBuilder.DropIndex(
                name: "IX_Appointments_appUserId",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "appUserId",
                table: "Appointments");
        }
    }
}
