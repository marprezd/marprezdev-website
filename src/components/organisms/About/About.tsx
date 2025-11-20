// src/components/organisms/About/About.tsx
"use client"

import { Box, Container, Grid } from "@mantine/core"
import Profile from "../Profile/Profile"
import * as styles from "./About.css"
import Skills from "./Skills"

export default function About() {
  return (
    <Container
      fluid
      className={styles.outerContainer}
      style={{
        background: `light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-8))`,
      }}
    >
      <Box className={styles.innerContainer}>
        {/* Profile Section */}
        <Grid className={styles.aboutGrid}>
          <Profile />
        </Grid>
        {/* Skills Section */}
        <Grid
          mt={{ base: 30, sm: 40, lg: 60 }}
          className={styles.aboutGrid}
          justify="center"
          align="center"
        >
          <Skills />
        </Grid>
      </Box>
    </Container>
  )
}
