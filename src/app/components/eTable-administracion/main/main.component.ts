import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { User } from "src/app/domain/User";
import { UsuarioService } from "src/app/services/administracion/administracion-usuarios/usuarios.service";
import { Path } from "src/app/infrastructure/constans/Path";
import { Configuracion } from "src/app/domain/Configuracion";
import { SistemaGeneralService } from "src/app/services/administracion/sistema/sistema-general.service";

// Trick
var svgImage;
const Ciudades = [
  "Lambayeque",
  "Piura",
  "Tumbes",
  "Apurímac",
  "Arequipa",
  "Cusco",
  "Madre de Dios",
  "Puno",
  "Moquegua",
  "Tacna",
  "Ancash",
  "Cajamarca",
  "Huánuco",
  "La Libertad",
  "Pasco",
  "San Martín",
  "Ucayali",
  "Amazonas",
  "Loreto",
  "Ayacucho",
  "Callao",
  "Huancavelica",
  "Ica",
  "Junín",
  "Lima",
];

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.css"],
})
export class MainComponent implements OnInit {
  @ViewChild("peruMap", { static: true }) peruMap: ElementRef;

  public load: boolean;
  public loading: string;
  public authentication: boolean;
  public user: User;
  public cliente: boolean;
  public configuracion: Configuracion;
  constructor(
    private service: UsuarioService,
    private config: SistemaGeneralService
  ) {
    this.user = new User();
    this.configuracion = new Configuracion();
    this.load = true;
    this.loading = Path.loading;
    this.cliente = true;
  }

  imageSvg: any;

  ngOnInit() {
    const auth = localStorage.getItem("authentication");
    this.getAuth(auth);
  }

  ngAfterViewInit() {
    svgImage = this.peruMap.nativeElement;

    if (window.addEventListener) {
      window.addEventListener("storage", this.changeColor, false);
    }
  }

  private getConfiguracion() {
    this.config.getConfiguracionSistemaGeneral().subscribe((data) => {
      this.configuracion = data;
      if (this.configuracion.empnombre == null) {
        this.configuracion.empnombre = "Sin nombre";
      }
      if (this.configuracion.empdescripcion == null) {
        this.configuracion.empdescripcion = "Sin descripcion";
      }
    });
  }

  getAuth(auth: string) {
    if (auth === "true") {
      this.getUserName();
      this.authentication = true;
    } else {
      this.authentication = false;
    }
  }

  private getUserName() {
    this.getConfiguracion();
    this.user.nickname = localStorage.getItem("nickname").toString();
    this.user.password = localStorage.getItem("password").toString();
    this.service.getUsuarioByAuthentication(this.user).subscribe(
      (o) => {
        if (o !== null) {
          this.load = false;
          this.user = o;
        }
      },
      (error) => {
        if (error) {
          this.authentication = false;
          localStorage.clear();
        }
      }
    );
  }

  /* the coolest code */
  changeColor(): void {
    const ciudad = localStorage.getItem("Ciudad");

    for (let cd of Ciudades) {
      const tag = svgImage.contentDocument.querySelector(`path[name="${cd}"]`);

      if (tag) {
        tag.style.fill = "#7c7c7c";
      }
    }

    const tag = svgImage.contentDocument.querySelector(
      `path[name="${ciudad}"]`
    );
    tag.style.fill = "#821625";
  }
}
