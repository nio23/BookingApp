using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class RemovedClientNamePropertyFromAppointmentEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_AspNetUsers_appUserId",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "ClientName",
                table: "Appointments");

            migrationBuilder.RenameColumn(
                name: "appUserId",
                table: "Appointments",
                newName: "AppUserId");

            migrationBuilder.RenameIndex(
                name: "IX_Appointments_appUserId",
                table: "Appointments",
                newName: "IX_Appointments_AppUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_AspNetUsers_AppUserId",
                table: "Appointments",
                column: "AppUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_AspNetUsers_AppUserId",
                table: "Appointments");

            migrationBuilder.RenameColumn(
                name: "AppUserId",
                table: "Appointments",
                newName: "appUserId");

            migrationBuilder.RenameIndex(
                name: "IX_Appointments_AppUserId",
                table: "Appointments",
                newName: "IX_Appointments_appUserId");

            migrationBuilder.AddColumn<string>(
                name: "ClientName",
                table: "Appointments",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_AspNetUsers_appUserId",
                table: "Appointments",
                column: "appUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
