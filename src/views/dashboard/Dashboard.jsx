import {
  Box,
  Flex,
  Icon,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import axiosClient from '../../axios-client';
import { FaBook, FaMailBulk, FaSwatchbook, FaUserCog, FaUserEdit, FaUserGraduate, FaUserTie } from 'react-icons/fa';
import DonutChart from '../../components/charts/DonutChart';
import BarChart from '../../components/charts/BarChart';

// Start StatCard component
function StatsCard(props) {
  const { title, stat, icon } = props;

  return (
    <Stat
      px={{ base: 2, md: 4 }}
      py={'3'}
      shadow={'xl'}
      border={'1px solid'}
      borderColor={"yellow.600"}
      rounded={'lg'}
    >
      <Flex justifyContent={'space-between'}>
        <Box pl={{ base: 2, md: 1 }}>
          <StatLabel fontSize={'20px'} fontWeight={'medium'} isTruncated>
            {title}
          </StatLabel>
          <StatNumber fontSize={'3xl'} fontWeight={'medium'}>
            {stat}
          </StatNumber>
        </Box>
        <Box
          my={'auto'}
          color={useColorModeValue('gray.800', 'gray.200')}
          alignContent={'center'}
        >
          {icon}
        </Box>
      </Flex>
    </Stat>
  );
}
// End StatCard component

export default function Dashboard() {

  const [apprenant, setApprenant] = useState('')
  const [admin, setAdmin] = useState('')
  const [respo, setRespo] = useState('')
  const [formation, setFormation] = useState('')
  const [module, setModule] = useState('')
  const [plainte, setPlainte] = useState('')


  // formations chart data
  const [formationChartData, setFormationChartData] = useState({
    series: [],
    options: {
      chart: {
        type: 'donut',
      },
      labels: [],
    },
  });

  // cerfificats chart data
  const [certificatChartData, setCertificatChartData] = useState({
    series: [],
    options: {
      chart: {
        type: 'donut',
      },
      labels: [],
    },
  });

  // plaintes par jours chart data
  const [plainteByDayChartData, setPlainteByDayChartData] = useState({
    series: [],
    options: {
      chart: {
        type: 'donut',
      },
      labels: [],
    },
  });

  // plaintes par jours chart data
  const [plainteByMonthChartData, setPlainteByMonthChartData] = useState({
    series: [],
    options: {
      chart: {
        type: 'donut',
      },
      labels: [],
    },
  });


  // apprenants par year chart data
  const [apprenantByYearChartData, setApprenantByYearChartData] = useState({
    options: {
      plotOptions: {
        bar: {
          distributed: true,
        }
      },
      chart: {
        type: "bar"
      },
      xaxis: {
        categories: []
      }
    },

    series: [
      {
        data: []
      }
    ]
  });




  // afficher la liste des apprenants
  const fetchApprenants = () => {
    axiosClient.get('apprenants/')
      .then((response) => {
        setApprenant(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // afficher la liste des responsables
  const fetchAdmins = () => {
    axiosClient.get('responsables/')
      .then((response) => {
        const filteredResponsables = response.data.filter(responsable => responsable.role === 'ADMIN');
        setAdmin(filteredResponsables);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // afficher la liste des responsables
  const fetchRespos = () => {
    axiosClient.get('responsables/')
      .then((response) => {
        const filteredResponsables = response.data.filter(responsable => responsable.role === 'RESPO');
        setRespo(filteredResponsables);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // afficher la liste des formations
  const fetchFormations = () => {
    axiosClient.get('formation/')
      .then((response) => {
        setFormation(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // afficher la liste des modules
  const fetchModules = () => {
    axiosClient.get('module/')
      .then((response) => {
        setModule(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // afficher la liste des plaintes
  const fetchPlaintes = () => {
    axiosClient.get('plainte/')
      .then((response) => {
        setPlainte(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // afficher le nombre de module par formation
  const fetchModulesParFormation = () => {
    axiosClient.get('module/formation_count/')
      .then((response) => {
        const series = response.data.map(item => item.count);
        const labels = response.data.map(item => item.formation__titre);
        setFormationChartData({
          series: series,
          options: {
            chart: {
              type: 'donut',
            },
            labels: labels,
            legend: { show: false }
          },
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // afficher le nombre de module par formation
  const fetchCertificatParModule = () => {
    axiosClient.get('certificat/module_count/')
      .then((response) => {
        const series = response.data.map(item => item.module_count);
        const labels = response.data.map(item => item.idResultat__idTest__idModule__titre);
        setCertificatChartData({
          series: series,
          options: {
            chart: {
              type: 'donut',
            },
            labels: labels,
            legend: { show: false }
          },
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // afficher le nombre de plainte par jours
  const fetchPlainteParJours = () => {
    // Helper function to get the day name based on day index (Sunday is 0, Monday is 1, etc.)
    const getDayName = (dayIndex) => {
      const daysOfWeek = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Venderedi', 'Samedi'];
      return daysOfWeek[dayIndex - 1];
    };
    axiosClient.get('plainte/plaintes_per_day/')
      .then((response) => {
        const data = response.data;

        const count = data.map(item => item.count);
        const days = data.map(item => {
          const dayIndex = item.day_of_week;
          const dayName = getDayName(dayIndex);
          return dayName;
        });
        setPlainteByDayChartData({
          series: count,
          options: {
            chart: {
              type: 'donut',
            },
            labels: days,
            legend: { show: false }
          },
        });

      })
      .catch((error) => {
        console.log(error);
      });
  }

  // afficher le nombre de plainte par mois
  const fetchPlainteParMois = () => {

    // Helper function to get the month name based on month index (January is 0, February is 1, etc.)
    const getMonthName = (monthIndex) => {
      const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
      return monthNames[monthIndex];
    };

    axiosClient.get('plainte/plaintes_per_month/')
      .then((response) => {
        const data = response.data;
        const count = data.map(item => item.count);
        const month = data.map(item => {
          const monthIndex = item.month ? new Date(item.month).getMonth() : -1;
          const monthName = getMonthName(monthIndex);
          return monthName;
        });
        setPlainteByMonthChartData({
          series: count,
          options: {
            chart: {
              type: 'donut',
            },
            labels: month,
            legend: { show: false }
          },
        });

      })
      .catch((error) => {
        console.log(error);
      });
  }

  // afficher le nombre des apprenants par année
  const fetchApprenantsParYear = () => {
    axiosClient.get('apprenants/apprenant_count_by_year/')
      .then((response) => {
        const count = response.data.apprenants_by_year.map(item => item.count);
        const years = response.data.apprenants_by_year.map(item => item.year);
        setApprenantByYearChartData({
          options: {
            chart: {
              type: "bar"
            },
            xaxis: {
              categories: years,
              labels: {
                show: false
              }
            }
          },
          series: [
            {
              data: count
            }
          ]
        });

      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    fetchApprenants()
    fetchAdmins()
    fetchRespos()
    fetchPlaintes()
    fetchFormations()
    fetchModules()
    fetchModulesParFormation()
    fetchCertificatParModule()
    fetchApprenantsParYear()
    fetchPlainteParJours()
    fetchPlainteParMois()
  }, []);

  return (
    <Box maxW="7xl" mx={'auto'} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
      <Text fontSize={30} mb={2}>Statistiques</Text>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 5, lg: 3 }}>
        <StatsCard
          title={'Administrateurs'}
          stat={admin.length}
          icon={
            <Icon as={FaUserTie} fontSize={45} color="green.500" />
          }
        />
        <StatsCard
          title={'Responsables'}
          stat={respo.length}
          icon={
            <Icon as={FaUserCog} fontSize={45} color="cyan.500" />
          }
        />
        <StatsCard
          title={'Apprenants'}
          stat={apprenant.length}
          icon={
            <Icon as={FaUserGraduate} fontSize={45} color="blue.500" />
          }
        />
        <StatsCard
          title={'Formations'}
          stat={formation.length}
          icon={
            <Icon as={FaBook} fontSize={45} color="yellow.500" />
          }
        />
        <StatsCard
          title={'Modules'}
          stat={module.length}
          icon={
            <Icon as={FaSwatchbook} fontSize={45} color="red.500" />
          }
        />
        <StatsCard
          title={'Tickets'}
          stat={plainte.length}
          icon={
            <Icon as={FaMailBulk} fontSize={45} color="purple.500" />
          }
        />
      </SimpleGrid>

      <Box
        mt={8}
        display={{ md: "flex" }}
        flexWrap={{ md: "wrap" }}
        justifyContent="space-between"
      >
        {/* Modules par formation chart */}
        <Box width={{ base: "100%", md: "45%" }}>
          <DonutChart title={"Modules par formarion"} data={formationChartData} />
        </Box>
        {/* Certificat par module chart */}
        <Box width={{ base: "100%", md: "45%" }}>
          <DonutChart title={"Certificats par module"} data={certificatChartData} />
        </Box>
      </Box>


      <Box mt={8}
        display={{ md: "flex" }}
        flexWrap={{ md: "wrap" }}
        justifyContent="space-between"
      >
        {/* Tickets par mois chart */}
        <Box width={{ base: "100%", md: "45%" }}>
          <DonutChart title={"Tickets par mois"} data={plainteByMonthChartData} />
        </Box>
        {/* Tickets par jours chart */}
        <Box width={{ base: "100%", md: "45%" }}>
          <DonutChart title={"Tickets par jours"} data={plainteByDayChartData} />
        </Box>
      </Box>
      <br />
      {/* Apprenant par annee chart */}
      <Box width={"100%"}>
        <BarChart title={"Apprenants par année"} data={apprenantByYearChartData} />
      </Box>

    </Box>



  );
}
